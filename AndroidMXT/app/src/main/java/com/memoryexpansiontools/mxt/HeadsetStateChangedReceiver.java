package com.memoryexpansiontools.mxt;

import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class HeadsetStateChangedReceiver extends BroadcastReceiver {
    public static final String LOG_TAG = HeadsetStateChangedReceiver.class.getName();
    @Override
    public void onReceive(Context context, Intent intent){
        int state = intent.getIntExtra(BluetoothProfile.EXTRA_STATE, BluetoothHeadset.STATE_DISCONNECTED);
        if(state == BluetoothHeadset.STATE_CONNECTED){
            TranscriptionManager.wakeup(context);
        } else if (state == BluetoothHeadset.STATE_DISCONNECTED){
            TranscriptionManager.stopTranscriptionOnHeadset();
        }
    }
}
