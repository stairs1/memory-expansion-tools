package com.example.jetpacksam;

import android.os.Bundle;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import android.util.Log;
import android.view.View;
import android.widget.TextView;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class ViewPhraseActivity extends AppCompatActivity {
    public static final String LOG_TAG = ViewPhraseActivity.class.getName();
    private PhraseViewModel mPhraseViewModel;
    private TextView phraseholder;
    private TextView dateholder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_phrase);
        Toolbar toolbar = findViewById(R.id.view_phrase_toolbar);
        setSupportActionBar(toolbar);
        int phraseID = getIntent().getIntExtra("phrase", 0);
        Log.d(LOG_TAG, "Got id in other activity: " + phraseID);

        mPhraseViewModel = new ViewModelProvider(this).get(PhraseViewModel.class);

        phraseholder = findViewById(R.id.phraseDetailPhrase);
        dateholder = findViewById(R.id.phraseDetailDate);

        mPhraseViewModel.getPhrase(phraseID).observe(this, new Observer<Phrase>() {
            @Override
            public void onChanged(@Nullable final Phrase phrase) {
                Instant stamp = Instant.parse(phrase.getTimestamp());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("- EEE, MMM d u. h:mm:ss a").withZone(ZoneId.systemDefault());
                dateholder.setText(formatter.format(stamp));
                phraseholder.setText(phrase.getPhrase());
            }
        });


        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

}
