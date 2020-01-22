package com.example.samdroid;

import android.app.*;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Parcelable;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.widget.Toast;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;



public class FullService extends IntentService {

    BluetoothHelper mBluetoothHelper;

    private boolean go;
    Context context;
    Integer counter;
    private int errcode = 0;
    private static int FOREGROUND_ID = 1;
    private static String channel_id = "sexy_channel";
    private static final String STOP_ELEMENT = "";
    private static final String RESULTS_IN = "93939";
    private static final String ERROR_SPEECH_TIMEOUT = "6";
    private static final String ERROR_NO_MATCH = "7";
    private static final String ERR_ELEMENT = "5439";

    public static final String LOG_TAG = FullService.class.getSimpleName();

    private Conversation conversation;

    public FullService() {
        super("FullService");
        go = false;
    }

    protected SpeechRecognizer mSpeechRecognizer;
    final LinkedBlockingQueue<String> queueu = new LinkedBlockingQueue<>();
    Intent recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);

    private class BluetoothHelper extends BluetoothHeadSetUtils
    {
        public BluetoothHelper(Context context)
        {
            super(context);
        }

        @Override
        public void onScoAudioDisconnected()
        {
            Log.d(LOG_TAG, "sco audio disconnected");
        }

        @Override
        public void onScoAudioConnected()
        {
            Log.d(LOG_TAG, "sco audio connected");
        }

        @Override
        public void onHeadsetDisconnected()
        {
            Log.d(LOG_TAG, "utils -- headset disconnected");

            Intent intent_disco = new Intent();
            intent_disco.setAction("com.example.samdroid");
            intent_disco.putExtra("WITH_HEADSET", "Using built-in mic");
            sendBroadcast(intent_disco);
        }

        @Override
        public void onHeadsetConnected()
        {
            Log.d(LOG_TAG, "utils -- headset connected");

            Intent intent1 = new Intent();
            intent1.setAction("com.example.samdroid");
            intent1.putExtra("WITH_HEADSET", "Using headset");

            sendBroadcast(intent1);
        }
    }

    @Override
    public void onCreate(){
        super.onCreate();
        context = this;
        conversation = new Conversation(context);
        mBluetoothHelper = new BluetoothHelper(context);
        mBluetoothHelper.start();

        mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
        mSpeechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {}

            @Override
            public void onBeginningOfSpeech() {}

            @Override
            public void onRmsChanged(float rmsdB) {}

            @Override
            public void onBufferReceived(byte[] buffer) {}

            @Override
            public void onEndOfSpeech() {
                queueu.add(STOP_ELEMENT);
            }

            @Override
            public void onError(int error) {
                errcode = error;
                queueu.add(ERR_ELEMENT);
            }

            @Override
            public void onResults(Bundle results) {
                List<String> recognitions = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                queueu.addAll(recognitions);
                queueu.add(RESULTS_IN);
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                List<String> notsorecognitions = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                queueu.addAll(notsorecognitions);
            }

            @Override
            public void onEvent(int eventType, Bundle params) {}


        });

        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 200);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.US.toString());
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
        Intent intent_started = new Intent();
        intent_started.setAction("com.example.samdroid");
        intent_started.putExtra("STARTED", "on");
        sendBroadcast(intent_started);

        startForeground(FOREGROUND_ID, buildForegroundNotification(channel_id));

        go = true;
        counter = 0;
        Handler mainHandler = new Handler(this.getMainLooper());
        while(go){
            String vrresults = null;
            try {
                if(queueu.size() > 0){
                    Log.d(LOG_TAG, "queueu size: " + queueu.size());
                    vrresults = queueu.take();
                    Log.d(LOG_TAG, "vrresults: " + vrresults);
                    if(vrresults == RESULTS_IN){
                        Log.d(LOG_TAG, "end of rec encountered, restarting listener");
                        counter=0;
                        mainHandler.post(listen);
                    }
                    else if(vrresults == ERR_ELEMENT){
                        if(errcode == 6){
                            Log.d(LOG_TAG, "speech timeout, restarting listener");
                        }
                        else if(errcode == 7){
                            Log.d(LOG_TAG, "no match, restarting");
                        }
                        Thread.sleep(100);
                        mainHandler.post(listen);
                    }
                    else if(vrresults != STOP_ELEMENT && vrresults != null) {
                        if(counter > 0){ //just take first element
                            continue;
                        }
                        SendHTTP.send_phrase(vrresults, this);
                        counter+=1;
                        conversation.addPhrase(vrresults);
                        Intent intent1 = new Intent();
                        intent1.setAction("com.example.samdroid");

                        List<String> phrases = conversation.getPhrases();
                        String[]bobsarray = new String[0];
                        String[] parray = phrases.toArray(bobsarray);
                        intent1.putExtra("DATAPASSED", parray);
                        Log.d(LOG_TAG, "data[0]: " + parray[0]);

                        List<String> stage = conversation.getStage();
                        String[] sarray = stage.toArray(bobsarray);
                        intent1.putExtra("STAGE", sarray);

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
        Log.d(LOG_TAG, "On Destroy");
        go = false;
        Handler mainHandler = new Handler(this.getMainLooper());
        mainHandler.post(kill);
        mBluetoothHelper.stop();
        Intent intent_started = new Intent();
        intent_started.setAction("com.example.samdroid");
        intent_started.putExtra("STARTED", "off");
        sendBroadcast(intent_started);
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
