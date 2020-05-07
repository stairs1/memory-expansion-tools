package com.memoryexpansiontools.mxt;
import com.fxn.Bubble;
import com.fxn.BubbleTabBar;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

import androidx.appcompat.widget.Toolbar;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fxn.OnBubbleClickListener;
import com.google.android.material.navigation.NavigationView;
import com.memoryexpansiontools.mxt.CacheFragment;
import com.google.android.material.snackbar.Snackbar;

import java.util.List;


public class MainActivity extends AppCompatActivity {

    //bottom app bar ids
    public static final int stream_id = 2131296489;
    public static final int cache_id = 2131296332;
    public static final int tags_id = 2131296505;
    public static final int account_id = 2131296404;
    public static final int settings_id = 2131296469;

    public static final String LOG_TAG = MainActivity.class.getName();

    public static int loginCount = 0;

    private PhraseViewModel mPhraseViewModel;

    private AppBarConfiguration mAppBarConfiguration;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        Toolbar toolbar = findViewById(R.id.main_toolbar);
        setSupportActionBar(toolbar);

        TranscriptionManager.wakeup(this);

        //bottom tab bar setup

        BubbleTabBar bbtb = findViewById(R.id.bubbleTabBar);
        Activity act = this;
        bbtb.addBubbleListener(new OnBubbleClickListener() {
            public void onBubbleClick(int id){
                Intent intent;
                final NavController navController;
                navController = Navigation.findNavController(act, R.id.nav_host_fragment);
                Bubble o = findViewById(id);
                Log.d("cayden lv", o.toString());
                Log.d("cayden lv", o.getItem().toString());
                String choice = o.getItem().getTitle().toString();
                switch(choice){
                    case "Stream":
                        Log.d("cayden", "stream");
                        navController.navigate(R.id.nav_stream);
                        break;
                    case "Cache":
                        Log.d("cayden", "cache");
                        navController.navigate(R.id.nav_cache);
                        break;
                    case "Tags":
                        Log.d("cayden", "tags");
                        navController.navigate(R.id.nav_tags);
                        break;
                    case "Account":
                        Log.d("cayden", "account");
                        navController.navigate(R.id.nav_login);
                        break;
                    case "Settings":
                        Log.d("cayden", "settings");
                        navController.navigate(R.id.nav_settings);
                        break;

                }
                Log.d("cayden", Integer.toString(id));
            }
        });


        //NavigationView navigationView = findViewById(R.id.nav_view); //get the navigation view, which is the hamburger menu slide out page
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_stream, R.id.nav_cache, R.id.nav_login)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        //NavigationUI.setupWithNavController(navigationView, navController);
    }
}
