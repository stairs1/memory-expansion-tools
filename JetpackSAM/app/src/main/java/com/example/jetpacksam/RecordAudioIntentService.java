package com.example.jetpacksam;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.Context;
import android.util.Log;

public class RecordAudioIntentService extends IntentService {
    public static final String LOG_TAG = RecordAudioIntentService.class.getName();


    public RecordAudioIntentService() {
        super("RecordAudioIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(LOG_TAG, "starting record audio service");

        // start in foreground
        NotificationChannel channel = new NotificationChannel("13", "recording channel", NotificationManager.IMPORTANCE_DEFAULT);
        NotificationManager man = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        man.createNotificationChannel(channel);
        Notification notification = new Notification.Builder(this, "13")
                .setContentTitle("title for record")
                .setContentText("recording from the jetpack")
                .setTicker("actively recording")
                .setOngoing(true)
                .build();

        //sleep for now so that it ends at some point
        startForeground(1, notification);
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Log.d(LOG_TAG, "ending record audio service");
        stopForeground(Service.STOP_FOREGROUND_REMOVE);
        stopSelf();
    }
}
