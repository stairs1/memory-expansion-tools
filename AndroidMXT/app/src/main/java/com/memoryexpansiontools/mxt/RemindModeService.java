package com.memoryexpansiontools.mxt;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;

import androidx.preference.PreferenceManager;

public class RemindModeService extends Service {
    private int mInterval = 5000; // 5 seconds by default, can be changed later
    private Handler mHandler;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mHandler = new Handler();
        startRepeatingTask();

        //start foreground service
        NotificationChannel channel = new NotificationChannel("14", "transcription channel", NotificationManager.IMPORTANCE_LOW);
        NotificationManager man = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        man.createNotificationChannel(channel);
        Notification notification = new Notification.Builder(this, "14")
                .setContentTitle("Remind Mode")
                .setContentText("Remind Mode")
                .setTicker("Remind Mode")
                .setOngoing(true)
                .build();

        startForeground(1, notification);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        stopRepeatingTask();
    }

    Runnable mStatusChecker = new Runnable() {
        @Override
        public void run() {
            try {
                notifyUser(); //this function can change value of mInterval.
            } finally {
                // 100% guarantee that this always happens, even if
                // your update method throws an exception
                mHandler.postDelayed(mStatusChecker, mInterval);
            }
        }
    };

    void startRepeatingTask() {
        mStatusChecker.run();
    }

    void stopRepeatingTask() {
        mHandler.removeCallbacks(mStatusChecker);
    }

    void notifyUser(){
        Log.d("cayden", "interval");

        Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        v.vibrate(VibrationEffect.createOneShot(600, VibrationEffect.DEFAULT_AMPLITUDE));


        //find current time from preferences and then and update vibrationintexcdfv sdeswedddddsw2w334eeeeeerdfdrsxzxsdfccbghvgtyfetr2w3e234val
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        mInterval = 1000 * Integer.parseInt(preferences.getString("remind_interval", "120"));
        Log.d("cayden", "it is" + mInterval);
    }

}
