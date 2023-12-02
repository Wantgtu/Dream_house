
import UIManager from "../../cfw/ui";
import SDKManager from "../sdk/SDKManager";
import BaseRecorder from "../sdk/base/BaseRecorder";
import BagManager from "../../logic/public/bag/BagManager";
import EngineHelper from "../../engine/EngineHelper";
import { BaseView } from "../../cfw/view";
import TipC from "../../logic/public/tip/TipC";
import CMgr from "../channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";
import ShareController from "./ShareController";


export default class RecorderC extends ShareController {




    stopRecorder(view: BaseView) {
        // console.log(' stopRecorder ')
        console.log('------------------------------------------')
        let recorder: BaseRecorder = SDKManager.getChannel().getRecorder()
        recorder.stop(true, (r: number) => {
            // console.log(' 录屏裁剪结果 stop r ', r, recorder.getVideoPath())
            if (r) {

                recorder.publish((s: number) => {
                    // console.log(' 录屏分享结果 s ', s)
                    if (s) {
                        // MoneyMgr.instance().updateGoldNum(GOLD_NUM)
                        CMgr.helper.trackEvent(UmengEventID.buy_energy_use_share)
                        BagManager.instance().updateItem(this.getItem(), EngineHelper.getMidPos())
                    } else {
                        // console.log(' 录屏分享失败 s ', s)
                        TipC.instance().showToast('Sharing failure')
                    }

                    this.startRecorder();
                    UIManager.instance().popView(view)
                })
                // SDKManager.getChannel().showShare(0, (s: number) => {
                //     // console.log(' 录屏分享结果 s ', s)
                //     if (s) {
                //         // MoneyMgr.instance().updateGoldNum(GOLD_NUM)
                //         CMgr.helper.trackEvent(UmengEventID.buy_energy_use_share)
                //         BagManager.instance().updateItem(this.getItem(), EngineHelper.getMidPos())
                //     } else {
                //         // console.log(' 录屏分享失败 s ', s)
                //         TipC.instance().showToast('Sharing failure')
                //     }

                //     this.startRecorder();
                //     UIManager.instance().popView(view)
                // }, recorder.getVideoPath())
                recorder.clear()
            } else {
                // console.log(' 屏幕录制失败 r ', r)
                // SDKManager.getChannel().showShare(1, (rs: number) => {
                //     if (rs) {
                //         CMgr.helper.trackEvent(UmengEventID.buy_energy_use_share)
                //         BagManager.instance().updateItem(this.getItem(), EngineHelper.getMidPos())
                //     } else {
                //         TipC.instance().showToast('Sharing failure')
                //     }
                //     this.startRecorder();
                //     UIManager.instance().popView(view)
                // }, null)
                TipC.instance().showToast('The recording time is too short')
            }
            // console.log('++++++++++++++++++++++++++++++++++++++')
        })

    }

    startRecorder() {
        // let recorder = SDKManager.getChannel().getRecorder()
        let recorder = SDKManager.getChannel().getRecorder()
        if (recorder) {
            recorder.start();
        }

    }
}