package sdk.bridge;

import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * 穿山甲sdk 桥梁
 */
public class RewardAdBridge {

    public static final String TAG = "RewardAdBridge";


    public static Map<String,CsjAdNative> adFuncatin = new HashMap<String, CsjAdNative>();

    public static AppActivity _activity = null;

    public static String  _adId;

    public static void init(AppActivity activity) {
        _activity = activity;
    }

    public static void create(String params){
        String  adId = "";
        try {
            JSONObject json = new JSONObject(params);
            adId = json.getString("adUnitId");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        _adId = adId;
        //Log.d(TAG,"create ==>" + adId);
        CsjAdNative cjs = adFuncatin.get(adId);
        if(cjs == null){
            cjs = new CsjAdNative(adId);
            adFuncatin.put(adId,cjs);
        }
    }

    public static void load(String adId){
        //Log.d(TAG,"load = > " + adId);
        CsjAdNative cjs = adFuncatin.get(adId);
        if(cjs != null){
            cjs.load();
        }else{
            Log.d(TAG,"load null= > " + adId);
        }
    }

    public static void show(String adId){
       // Log.d(TAG,"show =》adId" + adId);
        CsjAdNative cjs = adFuncatin.get(adId);
        if(cjs != null){
            cjs.show();
        }
    }

    public static void destroy(String adId){
        //Log.d(TAG,"destroy = 》"+adId);
        CsjAdNative cjs = adFuncatin.get(adId);
        if(cjs != null){
            cjs.destroy();
        }
    }

    public static void hide(){
        Log.d(TAG,"hide");
    }

    public static void initAd(){
        Log.d(TAG,"initAd");
    }


    public static void exitApp(){
        Log.d(TAG,"exitApp");
    }


    public static void login(String params){
        Log.d(TAG,"login");
    }

    public static void getFileSystemManager(){
        Log.d(TAG,"getFileSystemManager");
        return;
    }

    //视频广告加载成功
    public static void rewardAdCallback(final String adId,final int code){
        _activity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String str = String.format(Locale.CHINESE,"%s$$%s",adId,String.valueOf( code ));
                Log.d(TAG,str);
                //自己游戏奖励
                Cocos2dxJavascriptJavaBridge.evalString(String.format("native.rewardAdCallback('%s')",str));
            }
        });
    }

    //通知激励视频完成
    public static void sendRewardAdClose(final String adId,final int code){
        _activity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String str = String.format(Locale.CHINESE,"%s$$%s",adId,String.valueOf( code ));
                //自己游戏奖励
                Cocos2dxJavascriptJavaBridge.evalString(String.format("native.rewardAdClose('%s')",str));
            }
        });
    }

}