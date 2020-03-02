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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class RecordAudioIntentService extends IntentService {
    public static final String LOG_TAG = RecordAudioIntentService.class.getName();
    public static final String DIRNAME = "audio_logs";
    public static String fileName = null;
    private MediaRecorder recorder = null;
    private boolean recording = false;
    File directory = null;

    @Override
    public void onCreate(){
        super.onCreate();
        directory = new File(getExternalFilesDir(null), DIRNAME);
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
        NotificationChannel channel = new NotificationChannel("13", "recording channel", NotificationManager.IMPORTANCE_LOW);
        NotificationManager man = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        man.createNotificationChannel(channel);
        Notification notification = new Notification.Builder(this, "13")
                .setContentTitle("title for record")
                .setContentText("recording from the jetpack")
                .setTicker("actively recording")
                .setOngoing(true)
                .build();

        startForeground(1, notification);
        startRecording();

        //save audio to file hourly, poll every minute
        Instant ptime = Instant.now();
        while(true){
            Instant ntime = Instant.now();
            if(!recording){
               break;
            }
            if(ChronoUnit.MINUTES.between(ptime, ntime) >= 60){
                Log.d(LOG_TAG, "creating new log file after time: " + ChronoUnit.MINUTES.between(ptime, ntime));
                ptime = ntime;
                stopRecording();
                startRecording();
            }
            try {
                Thread.sleep(60000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onDestroy(){
        Log.d(LOG_TAG, "ending record audio service");
        stopRecording();
        stopForeground(Service.STOP_FOREGROUND_REMOVE);
        super.onDestroy();
    }

    private void startRecording() {
        Date time = new Date();
        fileName = directory.getAbsolutePath() + "/" + time.getTime() + ".3gp";

        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setOutputFile(fileName);
        recorder.setAudioSamplingRate(16000);
        recorder.setAudioChannels(1);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_WB);

        try {
            recorder.prepare();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        }


        recorder.start();
        recording = true;
        Log.d(LOG_TAG, "recording started");
    }

    private void stopRecording() {
        Log.d(LOG_TAG, "stopRecording");
        if(recording){
            recording = false;
            try{
                recorder.stop();
                recorder.release();
            }
            catch (java.lang.RuntimeException e){
                Log.e(LOG_TAG, e.getMessage());

                //stop called right after start. Clean up useless file
                File file = new File(fileName);
                file.delete();
            }
        }
    }
}
