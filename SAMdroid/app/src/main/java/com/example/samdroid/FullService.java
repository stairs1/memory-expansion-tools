package com.example.samdroid;

import android.app.*;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;

import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;


public class FullService extends IntentService {
    private boolean go;
    Integer counter;
    private static int FOREGROUND_ID = 1;
    private static String channel_id = "sexy_channel";
    private static final String STOP_ELEMENT = "";

    public static final String LOG_TAG = FullService.class.getSimpleName();

    public FullService() {
        super("FullService");
        go = false;
    }

    protected SpeechRecognizer mSpeechRecognizer;
    final LinkedBlockingQueue<String> queueu = new LinkedBlockingQueue<>();
    Intent recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);

    @Override
    public void onCreate(){
        super.onCreate();

        final Context context = this;
        mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
        mSpeechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {

            }

            @Override
            public void onBeginningOfSpeech() {

            }

            @Override
            public void onRmsChanged(float rmsdB) {

            }

            @Override
            public void onBufferReceived(byte[] buffer) {

            }

            @Override
            public void onEndOfSpeech() {
                queueu.add(STOP_ELEMENT);
            }

            @Override
            public void onError(int error) {
                queueu.add(STOP_ELEMENT);
            }

            @Override
            public void onResults(Bundle results) {
                List<String> recognitions = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                queueu.addAll(recognitions);
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                List<String> notsorecognitions = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                queueu.addAll(notsorecognitions);
            }

            @Override
            public void onEvent(int eventType, Bundle params) {

            }
        });

        PackageManager pm = context.getPackageManager();
        List<ResolveInfo> installedList = pm.queryIntentActivities(new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0);
        boolean speechRecognitionInstalled = !installedList.isEmpty();

        if (!speechRecognitionInstalled) {
            String bob = SendUDP.send("not installed!");
        }
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Enter shell command");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        mSpeechRecognizer.startListening(recognizerIntent);
    }

    Runnable listen = new Runnable() {
        @Override
        public void run() {
            mSpeechRecognizer.startListening(recognizerIntent);
        }
    };

    Runnable kill = new Runnable() {
        @Override
        public void run() {
            mSpeechRecognizer.destroy();
        }
    };

    @Override
    protected void onHandleIntent(Intent intent) {
        startForeground(FOREGROUND_ID, buildForegroundNotification(channel_id));

        go = true;
        counter = 1;
        Handler mainHandler = new Handler(this.getMainLooper());
        while(go){
//            String sandy = SendUDP.send(counter.toString());
            String vrresults = null;
            try {
//                String tester1 = SendUDP.send("test before taking from queue");
                if(!queueu.isEmpty()){
                    vrresults = queueu.take();
                    if(vrresults == STOP_ELEMENT){
                        counter=1;
                        Thread.sleep(100);
                        mainHandler.post(listen);
                    }
                    else if(counter>1){ //just take first result for now
                        counter+=1;
                        continue;
                    }
                    else if(vrresults != STOP_ELEMENT && vrresults != null) {
                        String second = SendUDP.send(vrresults);
                        counter+=1;
                        Intent intent1 = new Intent();
                        intent1.setAction("com.example.samdroid");
                        intent1.putExtra("DATAPASSED", vrresults);
                        sendBroadcast(intent1);
                    }
                }
            } catch (InterruptedException e) {
                Log.d(LOG_TAG, "mSpeechRecognizer broke");
                e.printStackTrace();
            }

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onDestroy(){
        go = false;
        Handler mainHandler = new Handler(this.getMainLooper());
        mainHandler.post(kill);
        super.onDestroy();
    }

    private Notification buildForegroundNotification(String channel_id) {
        NotificationChannel nChannel = new NotificationChannel(channel_id, "bobs notes channel", NotificationManager.IMPORTANCE_HIGH);
        NotificationManager service = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        assert service != null;
        service.createNotificationChannel(nChannel);

        Notification biggie = new Notification.Builder(this, channel_id)
                .setContentTitle("the title of this notification")
                .setContentText("the body of the notification")
                .setTicker("doing stuff")
                .setOngoing(true)
                .build();

        return(biggie);
    }

}
