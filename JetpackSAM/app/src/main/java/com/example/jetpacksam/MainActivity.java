package com.example.jetpacksam;

import android.content.Intent;
import android.location.Location;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.Date;
import java.util.List;



public class MainActivity extends AppCompatActivity implements ItemClickListener{

    public static final int NEW_PHRASE_ACTIVITY_REQUEST_CODE = 1;
    public static final int VIEW_PHRASE_ACTIVITY_REQUEST_CODE = 2;
    public static final String LOG_TAG = MainActivity.class.getName();

    private PhraseViewModel mPhraseViewModel;
    private FusedLocationProviderClient fusedLocationClient;

    @Override
    public void onClick(View view, Phrase phrase){
        Log.d(LOG_TAG, "we got a click! This is what the phrase was: " + phrase.getPhrase() + " ---Primary key: " + phrase.getID());
        Intent intent = new Intent(MainActivity.this, ViewPhraseActivity.class);
        intent.putExtra("phrase", phrase.getID());
        startActivityForResult(intent, VIEW_PHRASE_ACTIVITY_REQUEST_CODE);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        RecyclerView recyclerView = findViewById(R.id.recyclerview);
        final PhraseListAdapter adapter = new PhraseListAdapter(this);
        adapter.setClickListener(this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

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
                Date time = new Date(data.getLongExtra(NewPhraseActivity.EXTRA_TIME, 0));

                fusedLocationClient.getLastLocation()
                        .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                            @Override
                            public void onSuccess(Location location) {
                                Phrase phrase = new Phrase(words, time, location);
                                Log.d(LOG_TAG, "phrase: " + words + ", " + "time: " + time + " lat: " + location.getLatitude() + " lon: " + location.getLongitude());
                                mPhraseViewModel.insert(phrase);
                            }
                        });

            } else {
                Toast.makeText(
                        getApplicationContext(),
                        R.string.empty_not_saved,
                        Toast.LENGTH_LONG).show();
            }
        }
    }
}
