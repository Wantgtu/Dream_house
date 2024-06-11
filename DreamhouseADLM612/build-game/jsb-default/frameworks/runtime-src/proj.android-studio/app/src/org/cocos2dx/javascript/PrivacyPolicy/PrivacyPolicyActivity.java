package org.cocos2dx.javascript.PrivacyPolicy;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;

import com.tencent.tmgp.dreamhousemerge.R;

/**
 * 隐私政策
 *
 * @author zhongfg
 */
public class PrivacyPolicyActivity extends Activity {

    private static final String TAG = PrivacyPolicyActivity.class.getSimpleName();

    private FrameLayout web_view_container;
    private WebView web_view;

    private final String LANGUAGE_CN = "zh-CN";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_privacy_policy);

        Button btn_close = findViewById(R.id.btn_close);
        btn_close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        initView();
    }

    private void initView() {

        web_view_container = findViewById(R.id.web_view_container);
        web_view = new WebView(getApplicationContext());
        ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
        web_view.setLayoutParams(params);
        web_view.setWebViewClient(new WebViewClient());
        //动态添加WebView，解决在xml引用WebView持有Activity的Context对象，导致内存泄露
        web_view_container.addView(web_view);

        String language = AppUtil.getLanguage(PrivacyPolicyActivity.this);
        Log.i(TAG, "当前语言：" + language);

        //隐私政策
//        if (LANGUAGE_CN.equals(language)) {
//            web_view.loadUrl("http://baidu.com");
//        } else {
//            web_view.loadUrl("http://baidu.com");
//        }

        //本地网页
        if (LANGUAGE_CN.equals(language)) {
            web_view.loadUrl("file:///android_asset/privacy_policy.html");
        } else {
            web_view.loadUrl("file:///android_asset/privacy_policy.html");
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        web_view_container.removeAllViews();
        web_view.destroy();
    }
}
