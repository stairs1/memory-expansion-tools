package com.example.jetpacksam;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.preference.PreferenceManager;

import java.util.List;

public class TranscriptionManager {
    /*
    Singleton class to handle transcription state, including headset usage
    Not thread safe

    Call these functions on app start or preference change
    wakeup: ensure headset and transcription are active if their preferences are on
    disable: turn off transcription
    stoptranscriptionOnHeadset: stop using headset
     */
    public static final String LOG_TAG = TranscriptionManager.class.getName();
    static BluetoothHeadset headset = null;
    static BluetoothDevice headsetDevice = null;
    static boolean headsetInUse = false;
    static boolean transcriptionOn = false;

    private static void startTranscription(Context context){
        if(!transcriptionOn) {
            transcriptionOn = true;
            SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
            if (sharedPreferences.getBoolean("transcribe", false)) {
                Intent intent = new Intent(context.getApplicationContext(), TranscribeIntentService.class);
                context.getApplicationContext().startService(intent);
            }
        }
    }

    public static void stopTranscription(Context context){
        transcriptionOn = false;
        Intent intent = new Intent(context.getApplicationContext(), TranscribeIntentService.class);
        context.getApplicationContext().stopService(intent);
        stopTranscriptionOnHeadset();
    }

    @SuppressLint("ApplySharedPref")
    public static void wakeup(Context context){
        context = context.getApplicationContext();
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        if(prefs.getBoolean("transcribe", false)){
            // check for permissions, and if gone, set transcription and headset preferences to off.
            // This prevents the app from entering a broken state when permissions
            // are revoked from settings.
            if(!SettingsActivity.SettingsFragment.checkPerms(context)){
                prefs.edit().putBoolean("transcribe", false).commit();
                prefs.edit().putBoolean("bluetooth_headset", false).commit();
                stopTranscriptionOnHeadset();
                stopTranscription(context);
                transcriptionOn = false;
                headsetInUse = false;
                return;
            }

            startTranscription(context);
            if (prefs.getBoolean("bluetooth_headset", false) && !headsetInUse) {
                // behind a flag because if it is already on, there is a flipflop behaviour
                startTranscriptionOnHeadset(context.getApplicationContext());
            }
        }
        else{
        }
    }

    static BluetoothProfile.ServiceListener bluetoothProfileServiceListener = new BluetoothProfile.ServiceListener() {
        @Override
        public void onServiceConnected(int profile, BluetoothProfile proxy) {
            headset = (BluetoothHeadset) proxy;
            List<BluetoothDevice> connectedDevices = headset.getConnectedDevices();
            if(connectedDevices.size() > 0) {
                headsetDevice = connectedDevices.get(0);

                //start voicerec, and if it is already started, restart it.
                if(headset.startVoiceRecognition(headsetDevice)){
                    headsetInUse = true;
                }
                else{
                }
            }
        }

        @Override
        public void onServiceDisconnected(int profile) {}
    };

    private static void startTranscriptionOnHeadset(Context context){
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        bluetoothAdapter.getProfileProxy(context, bluetoothProfileServiceListener, BluetoothProfile.HEADSET);
    }

    public static void stopTranscriptionOnHeadset(){
        if(headset != null && headsetDevice != null){
            if(headset.stopVoiceRecognition(headsetDevice)){
                headsetInUse = false;
            }
        }
    }
}
