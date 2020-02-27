package com.example.jetpacksam;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.Context;
import android.media.MediaRecorder;
import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.util.Date;

public class RecordAudioIntentService extends IntentService {
    public static final String LOG_TAG = RecordAudioIntentService.class.getName();
    public static final String DIRNAME = "audio_logs";
    private MediaRecorder recorder = null;
    public static String fileName = null;
    File directory = null;

    @Override
    public void onCreate(){
        super.onCreate();
        File directory = new File(getExternalFilesDir(null), "audio_logs");
        if(!directory.exists()){
            directory.mkdirs();
        }
    }

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
        startRecording();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Log.d(LOG_TAG, "ending record audio service");
        stopRecording();
        stopForeground(Service.STOP_FOREGROUND_REMOVE);
        stopSelf();
    }


    private void startRecording() {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setOutputFile(fileName);
        recorder.setAudioSamplingRate(16000);
        recorder.setAudioChannels(1);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        try {
            recorder.prepare();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        }

        Date time = new Date();
        fileName = directory.getAbsolutePath() + "/" + time.getTime() + ".3gp";

        recorder.start();
    }

    private void stopRecording() {
        recorder.stop();
        recorder.release();
        recorder = null;
    }
}
