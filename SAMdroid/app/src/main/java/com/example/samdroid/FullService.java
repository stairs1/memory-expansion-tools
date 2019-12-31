package com.example.samdroid;

import android.app.*;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
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
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;


public class FullService extends IntentService {
    private boolean go;
    Integer counter;
    private int errcode = 0;
    private static int FOREGROUND_ID = 1;
    private static String channel_id = "sexy_channel";
    private static final String STOP_ELEMENT = "";
    private static final String RESULTS_IN = "93939";
    private static final String ERROR_SPEECH_TIMEOUT = "6";
    private static final String ERROR_NO_MATCH = "7";
    private static final String ERR_ELEMENT = "5439";

    static BluetoothAdapter btAdapter;
    static BluetoothHeadset btHeadset;
    private static final String PLANTRON_MAC = "BC:F2:92:9F:A6:92";
    private static boolean btConnected = false;

    public static final String LOG_TAG = FullService.class.getSimpleName();

    private Conversation conversation;

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

        conversation = new Conversation();

        //use external mic if there is one already connected
        if(btConnected == true){
            Set<BluetoothDevice> pairedDevices = btAdapter.getBondedDevices();
            if (pairedDevices.size() > 0) {
                // There are paired devices. Get the name and address of each paired device.
                for (BluetoothDevice device : pairedDevices) {
                    Log.d(LOG_TAG, "name: " + device.getName());
                    Log.d(LOG_TAG, "MAC: " + device.getAddress()); // MAC address
                }
            }
            else{
                Log.d(LOG_TAG, "no paired devices");
            }
            for (BluetoothDevice device : pairedDevices){
                Log.d(LOG_TAG, "checking bluetooth device " + device.getName());
                if(btHeadset.startVoiceRecognition(device)){
                    Log.d(LOG_TAG, "started voicerec on headset");
                    break;
                }
            }
        }
        else{
            Log.d(LOG_TAG, "btconnected is false");
        }


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
            public void onEvent(int eventType, Bundle params) {

            }
        });

        PackageManager pm = context.getPackageManager();
        List<ResolveInfo> installedList = pm.queryIntentActivities(new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0);
        boolean speechRecognitionInstalled = !installedList.isEmpty();

        if (!speechRecognitionInstalled) {
            String bob = SendUDP.send("not installed!");
            Log.d(LOG_TAG, "not installed");
        }
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 200);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        mSpeechRecognizer.startListening(recognizerIntent);
    }

    public static void setupBluetooth(final Context context)
    {
        btAdapter = BluetoothAdapter.getDefaultAdapter();

        BluetoothProfile.ServiceListener mProfileListener = new BluetoothProfile.ServiceListener() {
            public void onServiceConnected(int profile, BluetoothProfile proxy)
            {
                if (profile == BluetoothProfile.HEADSET)
                {
                    btHeadset = (BluetoothHeadset) proxy;
                    btConnected = true;
                    Log.d(LOG_TAG, "Headset connected");
                    Toast toast = Toast.makeText(context, "Headset Connected", Toast.LENGTH_SHORT);
                    toast.show();
                }
            }
            public void onServiceDisconnected(int profile)
            {
                if (profile == BluetoothProfile.HEADSET) {
                    btHeadset = null;
                    btConnected = false;
                    Log.d(LOG_TAG, "Headset disco-connected");
                }
            }
        };

        btAdapter.getProfileProxy(context, mProfileListener, BluetoothProfile.HEADSET);
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
        counter = 0;
        Handler mainHandler = new Handler(this.getMainLooper());
        while(go){
//            String sandy = SendUDP.send(counter.toString());
            String vrresults = null;
            try {
//                String tester1 = SendUDP.send("test before taking from queue");
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
                        String second = SendUDP.send(vrresults);
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
