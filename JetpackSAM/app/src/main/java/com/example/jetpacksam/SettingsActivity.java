package com.example.jetpacksam;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SwitchPreference;

public class SettingsActivity extends AppCompatActivity {
    public static final String LOG_TAG = SettingsActivity.class.getName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.settings_activity);
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.settings, new SettingsFragment())
                .commit();
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

    }

    public static class SettingsFragment extends PreferenceFragmentCompat {
        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey);
            Log.d(LOG_TAG, "create prefs");
            SwitchPreference audioSwitch = findPreference("record_audio");
            if(audioSwitch != null){
                Log.d(LOG_TAG, "switch aint null");
                audioSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        Log.d(LOG_TAG, "recorind turned on, starting foreground service");
                        Intent intent = new Intent(getContext(), RecordAudioIntentService.class);
                        getContext().startService(intent);
                    }
                    return true;
                });
            }
        }
    }
}