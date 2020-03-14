package com.example.jetpacksam;

import android.content.Intent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.appcompat.widget.Toolbar;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;


public class MainActivity extends AppCompatActivity implements ItemClickListener{

    public static final int NEW_PHRASE_ACTIVITY_REQUEST_CODE = 1;
    public static final int VIEW_PHRASE_ACTIVITY_REQUEST_CODE = 2;
    public static final int SETTINGS_ACTIVITY_REQUEST_CODE = 2;
    public static final int LOGIN_ACTIVITY_REQUEST_CODE = 3; //I don't know what these are for yet but this looks cool
    public static final String LOG_TAG = MainActivity.class.getName();

    private PhraseViewModel mPhraseViewModel;

    @Override
    public void onClick(View view, Phrase phrase){
        Intent intent = new Intent(MainActivity.this, ViewPhraseActivity.class);
        intent.putExtra("phrase", phrase.getId());
        startActivityForResult(intent, VIEW_PHRASE_ACTIVITY_REQUEST_CODE);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.main_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item){

        switch(item.getItemId()){
            case R.id.action_settings:
                Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
                startActivityForResult(intent, SETTINGS_ACTIVITY_REQUEST_CODE);
                return true;
            case R.id.login:
                Intent logIntent = new Intent(MainActivity.this, LoginActivity.class);
                startActivityForResult(logIntent, LOGIN_ACTIVITY_REQUEST_CODE);
                return true;
            default: return super.onOptionsItemSelected(item);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.main_toolbar);
        setSupportActionBar(toolbar);

        RecyclerView recyclerView = findViewById(R.id.recyclerview);
        final PhraseListAdapter adapter = new PhraseListAdapter(this);
        adapter.setClickListener(this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        TranscriptionManager.wakeup(this);

        // Get a new or existing ViewModel from the ViewModelProvider.
        mPhraseViewModel = new ViewModelProvider(this).get(PhraseViewModel.class);

        mPhraseViewModel.getAllPhrases().observe(this, new Observer<List<Phrase>>() {
            @Override
            public void onChanged(@Nullable final List<Phrase> phrases) {
                // Update the cached copy of the words in the adapter.
                adapter.setPhrases(phrases);
            }
        });

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, NewPhraseActivity.class);
                startActivityForResult(intent, NEW_PHRASE_ACTIVITY_REQUEST_CODE);
            }
        });


    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == NEW_PHRASE_ACTIVITY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                String words = data.getStringExtra(NewPhraseActivity.EXTRA_WORD);
                mPhraseViewModel.addPhrase(words, getString(R.string.medium_text));
            }
        }
    }
}
