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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class MainActivity extends AppCompatActivity {
    public static final String LOG_TAG = MainActivity.class.getSimpleName();
    public TextView phrase1;
    public TextView phrase2;
    public TextView phrase3;
    public TextView phrase4;
    public TextView phrase5;
    public TextView phrase6;
    public TextView phrase7;
    public TextView phrase8;
    public TextView stage;
    Intent FullServiceIntent;

    BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String[] s1 = intent.getStringArrayExtra("DATAPASSED");
            ArrayList<String> phrases = new ArrayList(Arrays.asList(s1));
            if(phrases.size()>0) {
                phrase1.setText(phrases.get(0));
            }
            else {
                phrase1.setText("");
            }
            if(phrases.size()>1) {
                phrase2.setText(phrases.get(1));
            }
            else {
                phrase2.setText("");
            }
            if(phrases.size()>2) {
                phrase3.setText(phrases.get(2));
            }
            else {
                phrase3.setText("");
            }
            if(phrases.size()>3) {
                phrase4.setText(phrases.get(3));
            }
            else {
                phrase4.setText("");
            }
            if(phrases.size()>4) {
                phrase5.setText(phrases.get(4));
            }
            else{
                phrase5.setText("");
            }
            if(phrases.size()>5) {
                phrase6.setText(phrases.get(5));
            }
            else {
                phrase6.setText("");
            }
            if(phrases.size()>6) {
                phrase7.setText(phrases.get(6));
            }
            else {
                phrase7.setText("");
            }
            if(phrases.size()>7) {
                phrase8.setText(phrases.get(7));
            }
            else {
                phrase8.setText("");
            }
            String sstage = intent.getStringExtra("STAGE");
            stage.setText(sstage);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        phrase1 = findViewById(R.id.text1);
        phrase2 = findViewById(R.id.text2);
        phrase3 = findViewById(R.id.text3);
        phrase4 = findViewById(R.id.text4);
        phrase5 = findViewById(R.id.text5);
        phrase6 = findViewById(R.id.text6);
        phrase7 = findViewById(R.id.text7);
        phrase8 = findViewById(R.id.text8);
        stage = findViewById(R.id.stagecontents);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.example.samdroid");
        registerReceiver(broadcastReceiver, intentFilter);
    }

   public void doit(View view){
       Log.d(LOG_TAG, "doit");
       phrase8.setText("eggnog!");
       SendUDP.send("eggnoggin");
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

   public void onStop(){
       super.onStop();
       unregisterReceiver(broadcastReceiver);
   }

}
