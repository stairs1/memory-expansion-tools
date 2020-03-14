package com.example.jetpacksam;

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

    public static void wakeup(Context context){
        context = context.getApplicationContext();
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        if(prefs.getBoolean("transcribe", false)){
            Log.d(LOG_TAG, "transcription is on, ensure service started");
            startTranscription(context);
            if(prefs.getBoolean("bluetooth_headset", false)){
                startTranscriptionOnHeadset(context);
            }
        }
        else{
            Log.d(LOG_TAG, "transcription is off, don't start service");
        }
    }

    static BluetoothProfile.ServiceListener bluetoothProfileServiceListener = new BluetoothProfile.ServiceListener() {
        @Override
        public void onServiceConnected(int profile, BluetoothProfile proxy) {
            headset = (BluetoothHeadset) proxy;
            List<BluetoothDevice> connectedDevices = headset.getConnectedDevices();
            if(connectedDevices.size() > 0) {
                Log.d(LOG_TAG, "starting voicerec on headset");
                headsetDevice = connectedDevices.get(0);
                headset.startVoiceRecognition(headsetDevice);
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
            Log.d(LOG_TAG, "stopping voicerec on headset");
            headset.stopVoiceRecognition(headsetDevice);
        }
    }
}
