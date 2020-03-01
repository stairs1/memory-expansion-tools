package com.example.jetpacksam;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
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
            createRecordAudioSwitchListener(findPreference("record_audio"));
            createTranscriptionSwitchListener(findPreference("transcribe"));
        }

        private void createRecordAudioSwitchListener(SwitchPreference audioSwitch){
            if(audioSwitch != null){
                Context context = getContext();
                audioSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        Log.d(LOG_TAG, "recording setting turned on, starting foreground service");
                        Intent intent = new Intent(context, RecordAudioIntentService.class);
                        context.startService(intent);
                    }
                    else if(newValue.toString().equals("false")){
                        Log.d(LOG_TAG, "recording setting turned off, stopping");
                        Intent intent = new Intent(context, RecordAudioIntentService.class);
                        context.stopService(intent);
                    }
                    return true;
                });
            }
        }

        private void createTranscriptionSwitchListener(SwitchPreference transcriptionSwitch){
            if (transcriptionSwitch != null){
                Context context = getContext();
                transcriptionSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        Log.d(LOG_TAG, "transcription turned on, starting foreground service");
//                        Intent intent = new Intent(context)

                    }
                    else if(newValue.toString().equals("false")){
                        Log.d(LOG_TAG, "transcription turned on, stopping foreground service");

                    }
                    return true;
                });
            }

        }
    }
}