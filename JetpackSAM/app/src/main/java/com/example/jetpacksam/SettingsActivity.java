package com.example.jetpacksam;

import android.Manifest;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SwitchPreference;

public class SettingsActivity extends AppCompatActivity {
    public static final String LOG_TAG = SettingsActivity.class.getName();
    public static final int PERMISSION_REQUEST = 66;
    static Runnable transcriptionSwitchCallback = null;

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

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if(requestCode == PERMISSION_REQUEST) {
            if(grantResults.length == 2
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED
                    && grantResults[1] == PackageManager.PERMISSION_GRANTED){
                Log.d(LOG_TAG, "all perms granted");
            }
            else{
                Log.d(LOG_TAG, "a permission was denied");
                transcriptionSwitchCallback.run();
            }
        }
    }

    public static class SettingsFragment extends PreferenceFragmentCompat {

        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey);
            Log.d(LOG_TAG, "create prefs");
            SwitchPreference transcriptionPreference = findPreference("transcribe");
            SettingsActivity.transcriptionSwitchCallback = (() -> {
                transcriptionPreference.setChecked(false);
            });
            createTranscriptionSwitchListener(findPreference("transcribe"));
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

        // Responds to preference changes, eg to start or stop transcription
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

        // Manages permissions by requiring them when transcription is switched on
        private void createTranscriptionSwitchListener(SwitchPreference transcriptionSwitch){
            if (transcriptionSwitch != null){
                transcriptionSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        Log.d(LOG_TAG, "transcription switched on, check permissions");
                        if(ActivityCompat.checkSelfPermission( getActivity(), Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED){
                            ActivityCompat.requestPermissions(
                                    getActivity(),
                                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.ACCESS_FINE_LOCATION},
                                    PERMISSION_REQUEST
                            );
                        }
                    }
                    return true;
                });
            }
        }
    }
}
