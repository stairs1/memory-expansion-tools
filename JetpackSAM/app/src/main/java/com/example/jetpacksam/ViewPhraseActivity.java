package com.example.jetpacksam;

import android.location.Location;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import android.util.Log;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ViewPhraseActivity extends AppCompatActivity {
    public static final String LOG_TAG = ViewPhraseActivity.class.getName();
    private PhraseViewModel mPhraseViewModel;
    private TextView phraseholder;
    private TextView dateholder;
    private TextView latitudeholder;
    private TextView longitudeholder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_phrase);
        Toolbar toolbar = findViewById(R.id.view_phrase_toolbar);
        setSupportActionBar(toolbar);
        int phraseID = getIntent().getIntExtra("phrase", 0);
        Log.d(LOG_TAG, "Got id in other activity: " + phraseID);

        mPhraseViewModel = new ViewModelProvider(this).get(PhraseViewModel.class);

        phraseholder = findViewById(R.id.phrase_detail_phrase);
        dateholder = findViewById(R.id.phrase_detail_date);
        latitudeholder = findViewById(R.id.latitude_textfield);
        longitudeholder = findViewById(R.id.longitude_textview);

        mPhraseViewModel.getPhrase(phraseID).observe(this, new Observer<Phrase>() {
            @Override
            public void onChanged(@Nullable final Phrase phrase) {
                Date stamp = phrase.getTimestamp();
                Location location = phrase.getLocation();
                Log.d(LOG_TAG, "lon: " + String.valueOf(location.getLongitude()));
                SimpleDateFormat formatter = new SimpleDateFormat("- EEE, MMM d u. h:mm:ss a");
                dateholder.setText(formatter.format(stamp));
                phraseholder.setText(phrase.getPhrase());
                latitudeholder.setText(String.valueOf(location.getLatitude()));
                longitudeholder.setText(String.valueOf(location.getLongitude()));
            }
        });


        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

}
