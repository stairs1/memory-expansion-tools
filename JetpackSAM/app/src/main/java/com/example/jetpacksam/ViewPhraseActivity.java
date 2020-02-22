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

import java.util.List;

public class ViewPhraseActivity extends AppCompatActivity {
    public static final String LOG_TAG = ViewPhraseActivity.class.getName();
    private PhraseViewModel mPhraseViewModel;
    private TextView phraseholder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_phrase);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        int phraseID = getIntent().getIntExtra("phrase", 0);
        Log.d(LOG_TAG, "Got id in other activity: " + phraseID);

        mPhraseViewModel = new ViewModelProvider(this).get(PhraseViewModel.class);

        phraseholder = findViewById(R.id.textView2);

        mPhraseViewModel.getPhrase(phraseID).observe(this, new Observer<Phrase>() {
            @Override
            public void onChanged(@Nullable final Phrase phrase) {
                phraseholder.setText(phrase.getPhrase());
            }
        });


        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
                finish();
            }
        });
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

}
