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


public class MainActivity extends AppCompatActivity {
    public static final String LOG_TAG = MainActivity.class.getSimpleName();
    public TextView displayt;
    Intent FullServiceIntent;

    BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String s1 = intent.getStringExtra("DATAPASSED");
            displayt.setText(s1);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        displayt = findViewById(R.id.text1);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.example.samdroid");
        registerReceiver(broadcastReceiver, intentFilter);
    }

   public void doit(View view){
       Log.d(LOG_TAG, "doit");
       displayt.setText("eggnog!");
       SendUDP.send("eggnoggin");
   }

   public void start_service(View view){
       Log.d(LOG_TAG, "start_service");
       displayt.setText("startingggggg");
       FullServiceIntent = new Intent(this, FullService.class);

       startService(FullServiceIntent);
   }

   public void stop_service(View view){
       Log.d(LOG_TAG, "top_service");
       displayt.setText("stop it!");
       stopService(FullServiceIntent);
   }

   public void onStop(){
       super.onStop();
       unregisterReceiver(broadcastReceiver);
   }

}
