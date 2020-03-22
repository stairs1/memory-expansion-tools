package com.example.jetpacksam;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;

import androidx.preference.PreferenceManager;

import java.util.List;
import java.util.Locale;


public class TranscribeIntentService extends IntentService {
    public static final String LOG_TAG = TranscribeIntentService.class.getName();
    private PhraseRepository repo = null;
    private ServerAdapter server = null;
    private Handler handler = null;
    SpeechRecognizer mSpeechRecognizer = null;
    Intent recogIntent = null;
    private boolean transcription_on = false;

    private String lastPhrase = ""; //this saves the last phrase that was spoken, used to get around the bug where the speech recognizer run onResults() twice

    public TranscribeIntentService() {
        super("TranscribeIntentService");
    }

    @Override
    public void onCreate(){
        super.onCreate();
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        recogIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recogIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.CANADA.toLanguageTag());
        recogIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        recogIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        recogIntent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, prefs.getBoolean("native_voicerec", false));
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

        //setup phrase creation interface
        repo = new PhraseRepository(getApplication());
        server = new ServerAdapter(getApplicationContext());

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
            handler.post(setupTranscription);
        }
    }

    private void startTranscription(){
        if(transcription_on) {
            handler.post(startTranscription);
        }
    }

    private void stopTranscription(){
        transcription_on = false;
        handler.post(stopTranscription);
    }

    private void restartTranscription(){
        handler.post(stopTranscription);
        handler.post(setupTranscription);
        handler.post(startTranscription);
    }

    Runnable setupTranscription = new Runnable() {
        @Override
        public void run() {
            //setup speech recognizer
            mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
            mSpeechRecognizer.setRecognitionListener(createRecognitionListener());
        }
    };

    Runnable startTranscription = new Runnable() {
        @Override
        public void run() {
            if(mSpeechRecognizer == null || recogIntent == null){
                Log.e(LOG_TAG, "Error: startTranscription called without initializing speechrecognizer or intent");
                return;
            }
            mSpeechRecognizer.startListening(recogIntent);
        }
    };

    Runnable stopTranscription = new Runnable() {
        @Override
        public void run() {
            mSpeechRecognizer.stopListening();
            mSpeechRecognizer.destroy();
        }
    };

    private RecognitionListener createRecognitionListener() {
        return new RecognitionListener() {
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
            }

            @Override
            public void onError(int error) {
                // Unlink and create new speechrecognizer on each error.
                // The speechrecognizer sends the error message before releasing
                // its resources. If call startRecognition right after receiving error,
                // the loop can enter a broken state.
                // This causes the old speechrecognizer to throw error complaining it is not
                // connected to recognition service; this error can be safely ignored.
                switch (error){
                    case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                        transcription_on = false;
                        stopTranscription();
                        break;
                    case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_NETWORK:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_CLIENT:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_AUDIO:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_NO_MATCH:
                        restartTranscription();
                        break;
                    case SpeechRecognizer.ERROR_SERVER:
                        // this error is thrown when using native voicerec on unsupported devices.
                        restartTranscription();
                        break;
                    default:
                        restartTranscription();
                        break;
                }
            }

            @Override
            public void onResults(Bundle results) {
                //create phrase with the first (most likely) result only
                List<String> sentences = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String words = sentences.get(0);
                if(words.isEmpty() || words.length() == 1 || (words.equals(lastPhrase))){
                    // if its one letter or less, its mostly garbage.,
                    //also, if the words are equal to the last phrase, it is a bug where onResults is called twice with the same results (but different confidence... I don't know man
                } else {
                    PhraseCreator.create(words, getString(R.string.medium_spoken), getApplicationContext(), repo, server);
                }

                lastPhrase = words;
                startTranscription();
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
