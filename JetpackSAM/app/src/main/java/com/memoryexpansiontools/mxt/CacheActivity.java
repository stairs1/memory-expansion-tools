package com.memoryexpansiontools.mxt;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.example.jetpacksam.R;

public class CacheActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cache);

        //Create the action bar for this activity
        Toolbar cache_toolbar = (Toolbar) findViewById(R.id.cache_toolbar);
;        setSupportActionBar(cache_toolbar);

        //Create and load a webview pointed at the memoryexpansiontools website
        //This allows the user to access MXT Cache directly within the app.
        WebView cacheWebView = (WebView) findViewById(R.id.cacheView);
        WebSettings webSettings = cacheWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        cacheWebView.loadUrl("https://www.memoryexpansiontools.com");
    }
}
