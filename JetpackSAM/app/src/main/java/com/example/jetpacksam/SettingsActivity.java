package com.example.jetpacksam;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.PreferenceManager;
import androidx.preference.SwitchPreference;

import java.util.Arrays;

public class SettingsActivity extends AppCompatActivity {
    public static final String LOG_TAG = SettingsActivity.class.getName();
    public static final int PERMISSION_REQUEST = 66;
    static Runnable transcriptionSwitchCallback = null;
    public static final String[] perms = {
        Manifest.permission.RECORD_AUDIO,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_BACKGROUND_LOCATION
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        TranscriptionManager.wakeup(this);
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

            // For now, require all permissions
            if(Arrays.stream(grantResults).anyMatch(i -> i == PackageManager.PERMISSION_DENIED)){
                Log.d(LOG_TAG, "a permission was denied");
                transcriptionSwitchCallback.run();
                new AlertDialog.Builder(SettingsActivity.this)
                        .setTitle("Why the permissions?")
                        .setMessage(
                                "The microphone is used to transcribe your speech\n\n" +
                                        "Location is used to let you remember ideas by place, " +
                                        "and where you were by what you were saying"
                        )
                        .setPositiveButton("ok", null)
                        .show();
            }
            else{
                Log.d(LOG_TAG, "all permissions granted");
                SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                prefs.edit().putBoolean("transcribe", true).commit();
                TranscriptionManager.wakeup(getApplicationContext());
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
            } else if (key.equals("native_voicerec")) {
                Log.d(LOG_TAG, "native voicerec switched");

                //TranscribeIntentService loads this preference on startup, so toggle transcription
                TranscriptionManager.stopTranscription(getContext());
                TranscriptionManager.wakeup(getContext());
            }
        };

        // If there are any missing return false
        public static boolean checkPerms(Context context){
            int granted = PackageManager.PERMISSION_GRANTED;
            for(String perm: perms){
                if(context.checkSelfPermission(perm) != granted){
                    return false;
                }
            }
            return true;
        }

        // Manages permissions by requiring them when transcription is switched on
        private void createTranscriptionSwitchListener(SwitchPreference transcriptionSwitch){
            if (transcriptionSwitch != null){
                transcriptionSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        Log.d(LOG_TAG, "transcription switched on, check permissions");
                        if(!checkPerms(getContext())){
                            ActivityCompat.requestPermissions( getActivity(), perms, PERMISSION_REQUEST );
                        }
                    }
                    return true;
                });
            }
        }
    }
}
