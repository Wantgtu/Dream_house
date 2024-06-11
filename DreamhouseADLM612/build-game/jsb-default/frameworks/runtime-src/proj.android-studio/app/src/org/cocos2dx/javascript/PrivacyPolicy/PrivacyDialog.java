package org.cocos2dx.javascript.PrivacyPolicy;

import android.app.Dialog;
import android.content.Context;
import android.os.Build;
import android.view.View;
import android.view.WindowManager;

import com.tencent.tmgp.dreamhousemerge.R;


public class PrivacyDialog extends Dialog {

    public PrivacyDialog(Context context) {
        super(context, R.style.PrivacyThemeDialog);

        setContentView(R.layout.dialog_privacy);

        setCancelable(false);
        setCanceledOnTouchOutside(false);
    }

    private void fullScreenImmersive(View view) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {

            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE

                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION

                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION

                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY

                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN

                    | View.SYSTEM_UI_FLAG_FULLSCREEN;

            view.setSystemUiVisibility(uiOptions);

        }

    }

    @Override
    public void show() {

        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);

        super.show();

        fullScreenImmersive(getWindow().getDecorView());

        this.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);

    }
}
