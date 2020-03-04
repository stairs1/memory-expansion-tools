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
            SwitchPreference bluetoothHeadsetSwitch = findPreference("bluetooth_headset");
            createBluetoothHeadsetSwitchListener(bluetoothHeadsetSwitch);
            BluetoothHeadsetManager.noHeadsetsCallback = (() -> {
                bluetoothHeadsetSwitch.setChecked(false);
            });
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
                        Intent intent = new Intent(context, TranscribeIntentService.class);
                        context.startService(intent);
                    }
                    else if(newValue.toString().equals("false")){
                        Log.d(LOG_TAG, "transcription turned off, stopping foreground service");
                        Intent intent = new Intent(context, TranscribeIntentService.class);
                        context.stopService(intent);
                    }
                    return true;
                });
            }

        }


        private void createBluetoothHeadsetSwitchListener(SwitchPreference bluetoothHeadsetSwitch){
            if (bluetoothHeadsetSwitch != null){
                Context context = getContext();
                bluetoothHeadsetSwitch.setOnPreferenceChangeListener((preference, newValue) -> {
                    if(newValue.toString().equals("true")){
                        if(BluetoothHeadsetManager.connectHeadset(context.getApplicationContext())){
                            Log.d(LOG_TAG, "bluetooth headset connection turned on");
                        }
                    }
                    else if(newValue.toString().equals("false")){
                        Log.d(LOG_TAG, "bluetooth headset connection turned off");
                        BluetoothHeadsetManager.disconnectHeadset();

                        //TODO headset may still be used after this is turned off.
                    }
                    return true;
                });
            }
        }
    }
}