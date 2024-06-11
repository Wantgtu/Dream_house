package sdk.bridge;

import android.content.Context;
import android.util.Log;

import com.bytedance.sdk.openadsdk.TTAdConfig;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAdSdk;

import org.cocos2dx.javascript.AppActivity;

/**
 * 穿山甲SDK
 */
public class TTAdManagerHolder {
    private static boolean sInit = false;
    public static final String TAG = "TTRewardVideo";
    public static AppActivity activity ;
    public static TTAdManager get() {
        if (!sInit) {
            throw new RuntimeException("TTAdSdk is not init, please check.");
        }
        return TTAdSdk.getAdManager();
    }
    public static void init(Context context) {
        activity = (AppActivity) context;
        doInit(context);
    }

    /**
     * 注册激励视频权限
     */
    public  static  void  initRewardIns(){
        //step1:初始化sdk
        TTAdManager ttAdManager = TTAdManagerHolder.get();
        //step2:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        ttAdManager.requestPermissionIfNecessary(activity);
    }


    //step1:接入网盟广告sdk的初始化操作，详情见接入文档和穿山甲平台说明
    private static void doInit(final Context context) {
        if (!sInit) {
            TTAdSdk.init(context, buildConfig(context));

            TTAdSdk.start(new TTAdSdk.Callback() {
                @Override
                public void success() {
                    Log.d(TAG,"success");
                    //注册激励视频
                    initRewardIns();
                }

                @Override
                public void fail(int i, String s) {
                    Log.d(TAG,"fail" +s);
                }
            });
            sInit = true;
        }
    }
    private static TTAdConfig buildConfig(Context context) {
        return new TTAdConfig.Builder()
                .appId(Constants.TT_ID)  //
                .useTextureView(true) //使用TextureView控件播放视频,默认为SurfaceView,当有SurfaceView冲突的场景，可以使用TextureView
                .appName(Constants.TT_GAME_NAME)
                .titleBarTheme(TTAdConstant.TITLE_BAR_THEME_DARK)
                .allowShowNotify(true) //是否允许sdk展示通知栏提示
                .debug(false) //测试阶段打开，可以通过日志排查问题，上线时去除该调用
                .directDownloadNetworkType(TTAdConstant.NETWORK_STATE_WIFI, TTAdConstant.NETWORK_STATE_3G) //允许直接下载的网络状态集合
                .supportMultiProcess(false)//是否支持多进程
                //.httpStack(new MyOkStack3())//自定义网络库，demo中给出了okhttp3版本的样例，其余请自行开发或者咨询工作人员
                .build();
    }
}
