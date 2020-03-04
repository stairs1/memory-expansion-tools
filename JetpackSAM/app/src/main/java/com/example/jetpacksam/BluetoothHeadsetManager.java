package com.example.jetpacksam;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.widget.Toast;

import java.util.List;

public class BluetoothHeadsetManager {
    public static final String LOG_TAG = BluetoothHeadsetManager.class.getName();
    public static Context context = null;
    static BluetoothHeadset headset = null;
    static BluetoothDevice headsetDevice = null;
    static Runnable noHeadsetsCallback = null;

    static BroadcastReceiver headsetReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            int state = intent.getIntExtra(BluetoothHeadset.EXTRA_STATE, BluetoothHeadset.STATE_DISCONNECTED);
            Log.d(LOG_TAG, "broadcast received: " + action + " state: " + state);
            if(state == BluetoothHeadset.STATE_AUDIO_CONNECTING){
                Log.d(LOG_TAG, "STATE AUDIO CONNECTING");
            }
            else if(state == BluetoothHeadset.STATE_AUDIO_CONNECTED){
                Log.d(LOG_TAG, "STATE AUDIO CONNECTED");
                Toast.makeText(context, "Bluetooth headset connected", Toast.LENGTH_SHORT).show();
            }
            else if(state == BluetoothHeadset.STATE_AUDIO_DISCONNECTED){
                Log.d(LOG_TAG, "STATE AUDIO DISCONNECTED");
            }
            else if(state == BluetoothHeadset.STATE_CONNECTED){
                Log.d(LOG_TAG, "STATE CONNECTED");
            }
            else if(state == BluetoothHeadset.STATE_DISCONNECTED){
                Log.d(LOG_TAG, "STATE DISCO-CONNECTED");
                noHeadsetsCallback.run();
            }
        }
    };

    static BluetoothProfile.ServiceListener bluetoothProfileServiceListener = new BluetoothProfile.ServiceListener() {
        @Override
        public void onServiceConnected(int profile, BluetoothProfile proxy) {
            BluetoothHeadset headset = (BluetoothHeadset) proxy;
            List<BluetoothDevice> connectedDevices = headset.getConnectedDevices();
            if(connectedDevices.size() > 0) {
                Log.d(LOG_TAG, "got headset");
                BluetoothDevice headsetDevice = connectedDevices.get(0);
                headset.startVoiceRecognition(headsetDevice);
                context.registerReceiver(headsetReceiver, new IntentFilter(BluetoothHeadset.ACTION_AUDIO_STATE_CHANGED));
                context.registerReceiver(headsetReceiver, new IntentFilter(BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED));
            }
            else if(noHeadsetsCallback != null){
                noHeadsetsCallback.run();
            }
        }

        @Override
        public void onServiceDisconnected(int profile) {

        }
    };

    public static boolean connectHeadset(Context ccontext){
        if(ccontext == null){
            return false;
        }
        context = ccontext;
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        bluetoothAdapter.getProfileProxy(context, bluetoothProfileServiceListener, BluetoothProfile.HEADSET);
        return true;
    }

    public static boolean disconnectHeadset(){
        if(headset != null && headsetDevice != null){
            headset.stopVoiceRecognition(headsetDevice);
        }
        return true;
    }

}
