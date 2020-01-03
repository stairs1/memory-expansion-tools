package com.example.samdroid;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.*;


public class MainActivity extends AppCompatActivity {
    public static final String LOG_TAG = MainActivity.class.getSimpleName();
    public static final String USER_ID = "5e0e6e1807cdcbd6a097708d";
    public TextView phrase1;
    public TextView phrase2;
    public TextView phrase3;
    public TextView phrase4;
    public TextView phrase5;
    public TextView phrase6;
    public TextView phrase7;
    public TextView phrase8;
    public TextView stage1;
    public TextView stage2;
    public TextView stage3;
    public TextView stage4;
    Intent FullServiceIntent;

    BroadcastReceiver broadcastReceiver;

    void setupReceiver() {
        Log.d(LOG_TAG, "setupReceiver");
        this.broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String[] s1 = intent.getStringArrayExtra("DATAPASSED");
                ArrayList<String> phrases = new ArrayList(Arrays.asList(s1));
                if (phrases.size() > 0) {
                    phrase1.setText(phrases.get(0));
                } else {
                    phrase1.setText("");
                }
                if (phrases.size() > 1) {
                    phrase2.setText(phrases.get(1));
                } else {
                    phrase2.setText("");
                }
                if (phrases.size() > 2) {
                    phrase3.setText(phrases.get(2));
                } else {
                    phrase3.setText("");
                }
                if (phrases.size() > 3) {
                    phrase4.setText(phrases.get(3));
                } else {
                    phrase4.setText("");
                }
                if (phrases.size() > 4) {
                    phrase5.setText(phrases.get(4));
                } else {
                    phrase5.setText("");
                }
                if (phrases.size() > 5) {
                    phrase6.setText(phrases.get(5));
                } else {
                    phrase6.setText("");
                }
                if (phrases.size() > 6) {
                    phrase7.setText(phrases.get(6));
                } else {
                    phrase7.setText("");
                }
                if (phrases.size() > 7) {
                    phrase8.setText(phrases.get(7));
                } else {
                    phrase8.setText("");
                }
                String[] stage = intent.getStringArrayExtra("STAGE");
                ArrayList<String> stages = new ArrayList(Arrays.asList(stage));
                if (stages.size() > 0) {
                    stage1.setText(stages.get(0));
                }
                if (stages.size() > 1) {
                    stage2.setText(stages.get(1));
                } else {
                    stage2.setText("");
                }
                if (stages.size() > 2) {
                    stage3.setText(stages.get(2));
                } else {
                    stage3.setText("");
                }
                if (stages.size() > 3) {
                    stage4.setText(stages.get(3));
                } else {
                    stage4.setText("");
                }

            }
        };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(LOG_TAG, "ONCREATE");
        super.onCreate(savedInstanceState);
        setupReceiver();
        setContentView(R.layout.activity_main);
        phrase1 = findViewById(R.id.text1);
        phrase2 = findViewById(R.id.text2);
        phrase3 = findViewById(R.id.text3);
        phrase4 = findViewById(R.id.text4);
        phrase5 = findViewById(R.id.text5);
        phrase6 = findViewById(R.id.text6);
        phrase7 = findViewById(R.id.text7);
        phrase8 = findViewById(R.id.text8);
        stage1 = findViewById(R.id.stage1);
        stage2 = findViewById(R.id.stage2);
        stage3 = findViewById(R.id.stage3);
        stage4 = findViewById(R.id.stage4);

        if(savedInstanceState!=null){
            phrase1.setText(savedInstanceState.getString("P1"));
            phrase2.setText(savedInstanceState.getString("P2"));
            phrase3.setText(savedInstanceState.getString("P3"));
            phrase4.setText(savedInstanceState.getString("P4"));
            phrase5.setText(savedInstanceState.getString("P5"));
            phrase6.setText(savedInstanceState.getString("P6"));
            phrase7.setText(savedInstanceState.getString("P7"));
            phrase8.setText(savedInstanceState.getString("P8"));
            stage1.setText(savedInstanceState.getString("S1"));
            stage2.setText(savedInstanceState.getString("S2"));
            stage4.setText(savedInstanceState.getString("S3"));
            stage4.setText(savedInstanceState.getString("S4"));
        }

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.example.samdroid");
        registerReceiver(broadcastReceiver, intentFilter);
    }

    @Override
    public void onStart() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.example.samdroid");
        registerReceiver(broadcastReceiver, intentFilter);

        super.onStart();
    }

    @Override
    protected void onSaveInstanceState(Bundle savedInstanceState){
        Log.d(LOG_TAG, "save instance state");
        savedInstanceState.putString("P1", (String)phrase1.getText());
        savedInstanceState.putString("P2", (String)phrase2.getText());
        savedInstanceState.putString("P3", (String)phrase3.getText());
        savedInstanceState.putString("P4", (String)phrase4.getText());
        savedInstanceState.putString("P5", (String)phrase5.getText());
        savedInstanceState.putString("P6", (String)phrase6.getText());
        savedInstanceState.putString("P7", (String)phrase7.getText());
        savedInstanceState.putString("P8", (String)phrase8.getText());
        savedInstanceState.putString("S1", (String)stage1.getText());
        savedInstanceState.putString("S2", (String)stage2.getText());
        savedInstanceState.putString("S3", (String)stage3.getText());
        savedInstanceState.putString("S4", (String)stage4.getText());

        super.onSaveInstanceState(savedInstanceState);
    }

   public void doit(View view){
       Log.d(LOG_TAG, "headset");
       SendUDP.send("headset connected");
       FullService.setupBluetooth(this);

   }

   public void start_service(View view){
       Log.d(LOG_TAG, "start_service");
       FullServiceIntent = new Intent(this, FullService.class);

       startService(FullServiceIntent);
   }

   public void stop_service(View view){
       Log.d(LOG_TAG, "top_service");
       stopService(FullServiceIntent);
   }

   public void send_data(View view){
       Log.d(LOG_TAG, "send data");
       SendAllPhrases sendalltask = new SendAllPhrases();
       sendalltask.execute(getApplicationContext());
   }

   @Override
   public void onStop(){
       unregisterReceiver(broadcastReceiver);
       super.onStop();
   }

}
