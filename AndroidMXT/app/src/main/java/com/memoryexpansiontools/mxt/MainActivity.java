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
import android.widget.FrameLayout;
import android.widget.ListView;

import androidx.appcompat.widget.Toolbar;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.app.ActivityCompat;
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

import static com.memoryexpansiontools.mxt.SettingsFragment.PERMISSION_REQUEST;
import static com.memoryexpansiontools.mxt.SettingsFragment.SubSettingsFragment.getPerms;


public class MainActivity extends AppCompatActivity {

    //bottom app bar ids
    public static final int stream_id = 2131296489;
    public static final int cache_id = 2131296332;
    public static final int tags_id = 2131296505;
    public static final int account_id = 2131296404;
    public static final int settings_id = 2131296469;
    private int mStreamVolume = 0;

    public static final String LOG_TAG = MainActivity.class.getName();

    public static int loginCount = 0;
    public Integer menu_state; //ave the state of the bubble menu (bottom menu)

    private PhraseViewModel mPhraseViewModel;

    private AppBarConfiguration mAppBarConfiguration;

    private BubbleTabBar bbtb;

    @Override
    public void onBackPressed() {
        Log.d("cayden", "I will never execute and you will never see me :(");
        super.onBackPressed();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        Toolbar toolbar = findViewById(R.id.main_toolbar);
        setSupportActionBar(toolbar);

        //go back to the last page we were on if this is waking back up
        if (menu_state != null){
        }

        // require settings on startup
        if(!SettingsFragment.SubSettingsFragment.checkPerms(getApplicationContext())){
            ActivityCompat.requestPermissions( this, getPerms(), PERMISSION_REQUEST );
        }

        TranscriptionManager.wakeup(this);

        //bottom tab bar setup

        bbtb = findViewById(R.id.bubbleTabBar);
        Activity act = this;
        bbtb.addBubbleListener(new OnBubbleClickListener() {
            public void onBubbleClick(int id){
                Intent intent;
                final NavController navController;
                menu_state = id;
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
                        navController.navigate(R.id.nav_new_settings);
                }
                Log.d("cayden", Integer.toString(id));
            }
        });


        //NavigationView navigationView = findViewById(R.id.nav_view); //get the navigation view, which is the hamburger menu slide out page
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_stream, R.id.nav_cache, R.id.nav_login, R.id.nav_new_settings, R.id.nav_tags)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        //NavigationUI.setupWithNavController(navigationView, navController);
    }

    @Override
    public void onSaveInstanceState(Bundle savedInstanceState) {
        super.onSaveInstanceState(savedInstanceState);
        // Save UI state changes to the savedInstanceState.
        // This bundle will be passed to onCreate if the process is
        // killed and restarted.
//        if(savedInstanceState != null){
//            savedInstanceState.putInt("page", menu_state);
//        }
    }

    @Override
    public void onResume(){
        super.onResume();
        TranscriptionManager.wakeup(getApplicationContext());

        // mute when we enter app, unmute when we leave
        AudioManager mAudioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
        if(mAudioManager.getStreamVolume(AudioManager.STREAM_MUSIC) != 0){
            mStreamVolume = mAudioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
            mAudioManager.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0);
        }
    }

    @Override
    public void onStop(){
        super.onStop();

        Log.d(LOG_TAG, "stopping main activity");
        TranscriptionManager.stopTranscription(getApplicationContext());
        AudioManager mAudioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
        mAudioManager.setStreamVolume(AudioManager.STREAM_MUSIC, mStreamVolume, 0);
    }
}
