package com.example.jetpacksam;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;

import java.util.List;
import java.util.Locale;


public class TranscribeIntentService extends IntentService {
    public static final String LOG_TAG = TranscribeIntentService.class.getName();
    private PhraseRepository repo = null;
    private Handler handler = null;
    SpeechRecognizer mSpeechRecognizer = null;
    Intent recogIntent = null;
    private boolean transcription_on = false;

    public TranscribeIntentService() {
        super("TranscribeIntentService");
    }

    @Override
    public void onCreate(){
        super.onCreate();
        handler = new Handler(this.getMainLooper());
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

        setupTranscription();
        startTranscription();
        while(transcription_on){
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onDestroy(){
        stopTranscription();
        super.onDestroy();
    }


    private void setupTranscription(){
        if(!transcription_on){
            transcription_on = true;
            handler.post(setupTranscriptionr);
        }
    }

    private void startTranscription(){
        if(transcription_on) {
            handler.post(startTranscriptionr);
        }
    }

    private void stopTranscription(){
        transcription_on = false;
        handler.post(stopTranscriptionr);
    }

    Runnable setupTranscriptionr = new Runnable() {
        @Override
        public void run() {
            //setup speech recognizer
            mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
            mSpeechRecognizer.setRecognitionListener(createRecognitionListener());
            recogIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.CANADA.toLanguageTag());
            recogIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            recogIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);

            //setup phrase creation interface
            repo = new PhraseRepository(getApplication());
        }
    };

    Runnable startTranscriptionr = new Runnable() {
        @Override
        public void run() {
            Log.d(LOG_TAG, "run starttranscription");
            if(mSpeechRecognizer == null || recogIntent == null){
                Log.e(LOG_TAG, "Error: startTranscription called without initializing speechrecognizer or intent");
                return;
            }
            mSpeechRecognizer.startListening(recogIntent);
        }
    };

    Runnable stopTranscriptionr = new Runnable() {
        @Override
        public void run() {
            mSpeechRecognizer.stopListening();
        }
    };

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
            public void onEndOfSpeech() { }

            @Override
            public void onError(int error) {
                switch (error){
                    case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                        Log.e(LOG_TAG, "SpeechRecognizer needs permissions!");
                        transcription_on = false;
                        break;
                    case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                        Log.d(LOG_TAG, "request ignored, recognizer busy");
                        break;
                    case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                        Log.d(LOG_TAG, "timeout");
                        try {
                            // If start a recognition request shortly after error, it will be ignored.
                            // this is presumably a bug in android.
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        startTranscription();
                        break;
                    case SpeechRecognizer.ERROR_NO_MATCH:
                        Log.d(LOG_TAG, "no match");
                        startTranscription();
                        break;
                    default:
                        Log.d(LOG_TAG, "defaulting to start" + error);
                        startTranscription();
                        break;
                }
            }

            @Override
            public void onResults(Bundle results) {
                //create phrase with the first (most likely) result only
                List<String> sentences = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                PhraseCreator.create(sentences.get(0), getString(R.string.medium_spoken), getApplicationContext(), repo);

                Log.d(LOG_TAG, "got results and created phrase, calling startTranscription");
                startTranscription();
            }

            @Override
            public void onPartialResults(Bundle partialResults) { }

            @Override
            public void onEvent(int eventType, Bundle params) { }
        };
    }
}
