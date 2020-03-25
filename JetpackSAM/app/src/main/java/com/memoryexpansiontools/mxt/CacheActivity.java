package com.memoryexpansiontools.mxt;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.example.jetpacksam.LoginActivity;
import com.example.jetpacksam.MainActivity;
import com.example.jetpacksam.R;
import com.example.jetpacksam.SettingsActivity;

public class CacheActivity extends AppCompatActivity {

    public static final int NEW_PHRASE_ACTIVITY_REQUEST_CODE = 1;
    public static final int VIEW_PHRASE_ACTIVITY_REQUEST_CODE = 2;
    public static final int SETTINGS_ACTIVITY_REQUEST_CODE = 2;
    public static final int LOGIN_ACTIVITY_REQUEST_CODE = 3;
    public static final int CACHE_ACTIVITY_REQUEST_CODE = 4; //I don't know what these are for yet but this looks cool

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.cache_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item){

        switch(item.getItemId()){
            case R.id.action_settings:
                Intent intent = new Intent(CacheActivity.this, SettingsActivity.class);
                startActivityForResult(intent, SETTINGS_ACTIVITY_REQUEST_CODE);
                return true;
            case R.id.login:
                Intent logIntent = new Intent(CacheActivity.this, LoginActivity.class);
                startActivityForResult(logIntent, LOGIN_ACTIVITY_REQUEST_CODE);
                return true;
            case R.id.stream:
                Intent streamIntent = new Intent(CacheActivity.this, MainActivity.class);
                startActivityForResult(streamIntent, CACHE_ACTIVITY_REQUEST_CODE);
                return true;
            default: return super.onOptionsItemSelected(item);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cache);

        Toolbar toolbar = findViewById(R.id.cache_toolbar);
        setSupportActionBar(toolbar);

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
