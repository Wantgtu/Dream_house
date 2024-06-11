package sdk.bridge;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.AppActivity;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;

/**
 * 创建多个原生广告位置
 */
public class CsjAdNative {
    public  final String TAG = "CsjAdNative";
    public  TTRewardVideoAd mttRewardVideoAd;
    public  boolean mHasShowDownloadActive = false;
    TTAdNative mTTAdNative = null;
    boolean mIsExpress = true; //是否请求模板广告
    boolean mIsLoaded = false; //视频是否加载完成
    private int ret = 0;
    int orientation = TTAdConstant.VERTICAL; //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
    public String AdId = "";

    /**
     * 创建多句柄创建多广告
     */

    public  CsjAdNative(String id){

        //id = Constants.TT_ID;

        AdId = id;
        this.mTTAdNative =  TTAdManagerHolder.get().createAdNative(AppActivity.getContext().getApplicationContext());
    }

    public void loadAd( String codeId, int orientation) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot;
        if (this.mIsExpress) {
            //个性化模板广告需要传入期望广告view的宽、高，单位dp，
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setRewardName("金币") //奖励的名称
                    .setRewardAmount(3)  //奖励的数量
                    //模板广告需要设置期望个性化模板广告的大小,单位dp,激励视频场景，只要设置的值大于0即可
                    .setExpressViewAcceptedSize(500,500)
                    .setUserID("user123")//用户id,必传参数
                    .setMediaExtra("media_extra") //附加参数，可选
                    .setOrientation(orientation) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                    .build();
        } else {
            //模板广告需要设置期望个性化模板广告的大小,单位dp,代码位是否属于个性化模板广告，请在穿山甲平台查看
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setRewardName("金币") //奖励的名称
                    .setRewardAmount(3)  //奖励的数量
                    .setUserID("user123")//用户id,必传参数
                    .setMediaExtra("media_extra") //附加参数，可选
                    .setOrientation(orientation) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                    .build();
        }
        //step5:请求广告
        this.mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
            @Override
            public void onError(int code, String message) {
                Log.d(TAG,"onError: " + code + ", " + String.valueOf(message));
                Toast.makeText(AppActivity.app, "onError: " + code + ", " + String.valueOf(message), Toast.LENGTH_LONG).show();
            }

            //视频广告加载后，视频资源缓存到本地的回调，在此回调后，播放本地视频，流畅不阻塞。
            @Override
            public void onRewardVideoCached() {
                mIsLoaded = true;
                RewardAdBridge.rewardAdCallback(AdId,1);
            }

            @Override
            public void onRewardVideoCached(TTRewardVideoAd ttRewardVideoAd) {

            }

            //视频广告的素材加载完毕，比如视频url等，在此回调后，可以播放在线视频，网络不好可能出现加载缓冲，影响体验。
            @Override
            public void onRewardVideoAdLoad(TTRewardVideoAd ad) {
                Log.e(TAG, "onRewardVideoAdLoad");
                //System.out.println("onRewardVideoAdLoad");
                mIsLoaded = false;
                mttRewardVideoAd = ad;
                mttRewardVideoAd.setRewardAdInteractionListener(new TTRewardVideoAd.RewardAdInteractionListener() {

                    @Override
                    public void onAdShow() {
                        // System.out.println("onAdShow===>");
                        // TToast.show(RewardVideoActivity.this, "rewardVideoAd show");
                    }

                    @Override
                    public void onAdVideoBarClick() {
                        // TToast.show(RewardVideoActivity.this, "rewardVideoAd bar click");
                        // TTGameRewardVideo.onLoadAD();
                    }

                    @Override
                    public void onAdClose() {
                        //System.out.println("onAdClose===>");
                        //TToast.show(RewardVideoActivity.this, "rewardVideoAd close");

                    }

                    //视频播放完成回调
                    @Override
                    public void onVideoComplete() {
                        //TToast.show(RewardVideoActivity.this, "rewardVideoAd complete");
                        //System.out.println("onVideoComplete===>");
                        ret = 1;
                        RewardAdBridge.sendRewardAdClose(AdId,ret);
                    }

                    @Override
                    public void onVideoError() {
                        System.out.println("onVideoError===>");
                        ret = 2;
                        Toast.makeText(AppActivity.app, "激励视频播放错误", Toast.LENGTH_LONG).show();
                    }

                    @Override
                    public void onRewardVerify(boolean b, int i, String s, int i1, String s1) {

                    }

                    @Override
                    public void onRewardArrived(boolean b, int i, Bundle bundle) {

                    }

                    //视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励梳理，rewardName：奖励名称

                    public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName) {
                        //TToast.show(RewardVideoActivity.this, "verify:" + rewardVerify + " amount:" + rewardAmount +
                        //       " name:" + rewardName);
                        //System.out.println("onRewardVerify===>"+rewardVerify);
                    }

                    @Override
                    public void onSkippedVideo() {
                        //TToast.show(RewardVideoActivity.this, "rewardVideoAd has onSkippedVideo");
                        ret = 3;
                    }
                });
                mttRewardVideoAd.setDownloadListener(new TTAppDownloadListener() {
                    @Override
                    public void onIdle() {
                        mHasShowDownloadActive = false;
                    }

                    @Override
                    public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadActive==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);

                        if (!mHasShowDownloadActive) {
                            mHasShowDownloadActive = true;
                            //TToast.show(RewardVideoActivity.this, "下载中，点击下载区域暂停", Toast.LENGTH_LONG);
                        }
                    }

                    @Override
                    public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadPaused===totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                        // TToast.show(RewardVideoActivity.this, "下载暂停，点击下载区域继续", Toast.LENGTH_LONG);
                    }

                    @Override
                    public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadFailed==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                        //  TToast.show(RewardVideoActivity.this, "下载失败，点击下载区域重新下载", Toast.LENGTH_LONG);
                    }

                    @Override
                    public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadFinished==totalBytes=" + totalBytes + ",fileName=" + fileName + ",appName=" + appName);
                        // TToast.show(RewardVideoActivity.this, "下载完成，点击下载区域重新下载", Toast.LENGTH_LONG);
                    }

                    @Override
                    public void onInstalled(String fileName, String appName) {
                        Log.d("DML", "onInstalled==" + ",fileName=" + fileName + ",appName=" + appName);
                        // TToast.show(RewardVideoActivity.this, "安装完成，点击下载区域打开", Toast.LENGTH_LONG);
                    }
                });
            }
        });

    }

    /**
     * 展示
     */
    public void show(){
        AppActivity.app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(mttRewardVideoAd != null ){
                    if(mIsLoaded){
                        mttRewardVideoAd.showRewardVideoAd(AppActivity.app,TTAdConstant.RitScenes.CUSTOMIZE_SCENES,"scenes_test");
                        mttRewardVideoAd = null;
                    }
                }else {
                    loadAd(AdId, TTAdConstant.VERTICAL);
                }
            }
        });
    }

    /**
     *加载
     */
    public void load(){
        loadAd(AdId, TTAdConstant.VERTICAL);
    }


    public  void destroy(){

    }

}
