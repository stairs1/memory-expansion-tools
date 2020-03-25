package com.memoryexpansiontools.mxt;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebView;

import com.example.jetpacksam.R;

public class CacheActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cache);

        //Create and load a webview pointed at the memoryexpansiontools website
        //This allows the user to access MXT Cache directly within the app.
        WebView cacheWebView = (WebView) findViewById(R.id.cacheView);
        cacheWebView.loadUrl("memoryexpansiontools.com");
    }
}
