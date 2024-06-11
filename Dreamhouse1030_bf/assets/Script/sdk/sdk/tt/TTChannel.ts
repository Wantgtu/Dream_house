import BaseChannel from "../base/BaseChannel";
import TTBannerAd from "./TTBannerAd";
import TTRecorder from "./TTRecorder";
import TTShare from "./TTShare";
import TTLogin from "./TTLogin";
import TTInsertAd from "./TTInsertAd";
import { ResultCallback, ADName, ResultState } from "../SDKConfig";
import TTScreenshot from "./TTScreenshot";
import TTRewardAd from "./TTRewardAd";
import BaseSubPackage from "../base/BaseSubPackage";
//需要跳转的appid参数

export default class TTChannel extends BaseChannel {



    private moreButton: any;
    init() {
        let cfg = this.cfg;
        if (this.sdk.createBannerAd) {
            let list = cfg[ADName.banner]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new TTBannerAd(this, adId))
                }
            }
        }
        if (this.sdk.createRewardedVideoAd) {
            // this.rewardAd = new TTVideoAd(this)
            let list = cfg[ADName.reward]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new TTRewardAd(this, adId))
                }
            }
        } else {

        }

        if (this.sdk.getGameRecorderManager) {
            this.recorder = new TTRecorder(this, cfg[ADName.recorder])
        } else {

        }

        if (this.sdk.shareAppMessage) {
            this.share = new TTShare(this, cfg[ADName.share])
        } else {

        }

        this.loginMgr = new TTLogin(this)

        if (this.sdk.createInterstitialAd) {
            let list = cfg[ADName.insert]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.insertAd.push(new TTInsertAd(this, adId))
                }
            }
        } else {
            console.log(' TTChannel createInterstitialAd   is null ')
        }

        this.screenshot = new TTScreenshot(this)

        this.subPackage = new BaseSubPackage(this)

        this.checkForUpdate()

    }

    hideMoreGameButton() {
        if (this.moreButton) {
            this.moreButton.hide()
        }
    }

    //创建更多游戏按钮
    createMoreGameButton(xr: number, yr: number, width: number, height: number) {
        if (this.moreButton) {
            this.moreButton.show()
            return;
        }
        if (this.sdk.createMoreGamesButton) {
            const systemInfo = this.sdk.getSystemInfoSync();
            console.log(' winsize ', systemInfo)
            // let width = 60
            // let height = 60;
            let x = systemInfo.windowWidth * xr;
            let y = systemInfo.windowHeight * yr;
            console.log(' x  ', x, ' y ', y, ' xr ', xr, ' yr ', yr, width)
            const btn = this.sdk.createMoreGamesButton({
                type: "image",
                image: "more_game.png",
                style: {
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    // lineHeight: 40,
                    // backgroundColor: "#ff0000",
                    // textColor: "#ffffff",
                    // textAlign: "center",
                    // fontSize: 16,
                    // borderRadius: 4,
                    // borderWidth: 1,
                    // borderColor: "#ff0000",
                },
                appLaunchOptions: this.getParamValue(ADName.launchOptionsConfig),
                onNavigateToMiniGameBox(res: any) {
                    console.log("跳转到小游戏盒子", res);
                },
            });
            this.moreButton = btn;
            btn.onTap(() => {
                console.log("点击更多游戏");
            });
        }

    }


    hasMoreGame() {
        const systemInfo = this.sdk.getSystemInfoSync();
        return systemInfo.platform !== "ios";
    }

    //显示更多游戏面板
    showMoreGameView() {
        const systemInfo = this.sdk.getSystemInfoSync();
        // iOS 不支持，建议先检测再使用
        if (systemInfo.platform !== "ios") {
            // 打开互跳弹窗
            if (this.sdk.showMoreGamesModal) {
                this.sdk.showMoreGamesModal({
                    appLaunchOptions: this.getParamValue(ADName.launchOptionsConfig),
                    success(res: any) {
                        console.log("success", res.errMsg);
                    },
                    fail(res: any) {
                        console.log("fail", res.errMsg);
                    },
                });
            }

        }
    }

    showAppBoxAd(site: number) {
        this.showMoreGameView();
    }

    exitApplication() {
        this.sdk.exitMiniProgram({
            isFullExit: true,
        })
    }

    vibrateShort() {
        this.sdk.vibrateShort({
            success(res: any) {
                //   console.log(`${res}`);
            },
            fail(res: any) {
                //   console.log(`vibrateShort调用失败`);
            }
        });
    }
    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }

    //展示网络图片
    previewImage(imgUrl: string) {
        this.sdk.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }
    checkForUpdate() {
        //小游戏官方的分包加载方式
        if (this.sdk.getUpdateManager) {
            const updateManager = this.sdk.getUpdateManager();
            console.log("getUpdateManager", updateManager);
            updateManager.onCheckForUpdate((res: any) => {
                // 请求完新版本信息的回调
                console.log("onCheckForUpdate", res.hasUpdate);
                if (res.hasUpdate) {
                    this.sdk.showToast({
                        title: "即将有更新请留意"
                    });
                } else {

                }
            });

            updateManager.onUpdateReady(() => {
                this.sdk.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否立即使用？",
                    success: (res: any) => {
                        if (res.confirm) {
                            // 调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        } else {
                            this.sdk.showToast({
                                icon: "none",
                                title: "小程序下一次「冷启动」时会使用新版本"
                            });
                        }
                    }
                });
            });

            updateManager.onUpdateFailed(() => {
                this.sdk.showToast({
                    title: "更新失败，下次启动继续..."
                });
            });
        } else {
        }
    }


    hasSubPackage() {
        return true;
    }
}