package com.example.jetpacksam;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import java.util.Locale;


public class TranscribeIntentService extends IntentService {
    private boolean transcribe = false;
    SpeechRecognizer mSpeechRecognizer = null;

    public TranscribeIntentService() {
        super("TranscribeIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        //start foreground service
        NotificationChannel channel = new NotificationChannel("14", "transcription channel", NotificationManager.IMPORTANCE_LOW);
        NotificationManager man = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        man.createNotificationChannel(channel);
        Notification notification = new Notification.Builder(this, "14")
                .setContentTitle("transcribe")
                .setContentText("transcribing")
                .setTicker("transcribing")
                .setOngoing(true)
                .build();

        startForeground(1, notification);
        startTranscription();

    }

    @Override
    public void onDestroy(){
        stopTranscription();
        super.onDestroy();
    }

    private void startTranscription(){
        if(!transcribe){
            //setup speech recognizer
            mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
            mSpeechRecognizer.setRecognitionListener(createRecognitionListener());
            Intent recogIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.CANADA.toLanguageTag());
            recogIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            recogIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);

            transcribe = true;
            mSpeechRecognizer.startListening(recogIntent);

            transcription_loop();
        }
    }

    private void stopTranscription(){
        transcribe = false;
    }

    private void transcription_loop(){
        while(transcribe){

        }
    }

    private RecognitionListener createRecognitionListener() {
        return new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) { }

            @Override
            public void onBeginningOfSpeech() { }

            @Override
            public void onRmsChanged(float rmsdB) { }

            @Override
            public void onBufferReceived(byte[] buffer) { }

            @Override
            public void onEndOfSpeech() {

            }

            @Override
            public void onError(int error) { }

            @Override
            public void onResults(Bundle results) {
                //create phrase with results
            }

            @Override
            public void onPartialResults(Bundle partialResults) {

            }

            @Override
            public void onEvent(int eventType, Bundle params) {

            }
        };
    }
}
