package com.example.jetpacksam;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.PreferenceFragmentCompat;

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
        }

        @Override
        public void onResume() {
            super.onResume();
            getPreferenceManager().getSharedPreferences().registerOnSharedPreferenceChangeListener(listener);
        }

        @Override
        public void onPause() {
            super.onPause();
            getPreferenceManager().getSharedPreferences().unregisterOnSharedPreferenceChangeListener(listener);
        }

        SharedPreferences.OnSharedPreferenceChangeListener listener = (sharedPreferences, key) -> {

            if (key.equals("transcribe")) {
                Log.d(LOG_TAG, "transcribe switched");
                if (sharedPreferences.getBoolean("transcribe", false)) {
                    TranscriptionManager.wakeup(getContext());
                } else {
                    TranscriptionManager.stopTranscription(getContext());
                }
            } else if (key.equals("bluetooth_headset")) {
                Log.d(LOG_TAG, "bluetooth switched");
                if (sharedPreferences.getBoolean("bluetooth_headset", false)) {
                    TranscriptionManager.wakeup(getContext());
                } else {
                    TranscriptionManager.stopTranscriptionOnHeadset();
                }
            }
        };
    }
}
