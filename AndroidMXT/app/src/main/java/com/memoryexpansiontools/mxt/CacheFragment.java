package com.memoryexpansiontools.mxt;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.ClipData;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;

import java.util.List;

public class CacheFragment extends Fragment implements ItemClickListener {

    public static final int NEW_PHRASE_ACTIVITY_REQUEST_CODE = 1;
    public static final int VIEW_PHRASE_ACTIVITY_REQUEST_CODE = 2;
    public static final int SETTINGS_ACTIVITY_REQUEST_CODE = 2;
    public static final int LOGIN_ACTIVITY_REQUEST_CODE = 3;
    public static final int CACHE_ACTIVITY_REQUEST_CODE = 4; //I don't know what these are for yet but this looks cool

    private ServerAdapter server;

    private CacheViewModel mPhraseViewModel;

//    @Override
//    public boolean onCreateOptionsMenu(Menu menu){
//        getMenuInflater().inflate(R.menu.cache_actionbar, menu);
//        return super.onCreateOptionsMenu(menu);
//    }

    @Override
    public void onClick(View view, Phrase phrase){
//        Intent intent = new Intent(MainActivity.this, ViewPhraseActivity.class);
//        intent.putExtra("phrase", phrase.getId());
//        startActivityForResult(intent, VIEW_PHRASE_ACTIVITY_REQUEST_CODE);
        //pass on this for now, need to make the phrase view thing a fragment as well
        Log.d("cayden", "click on cache talk");
    }

    public CacheFragment() {
        //required empty constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragmen
        return inflater.inflate(R.layout.cache_fragment, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        //create the server adapter and fetch the cache
        server = new ServerAdapter(this.getContext());
        server.getCache(getActivity().getApplication());

        RecyclerView recyclerView = view.findViewById(R.id.cache_talks_wall);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
        linearLayoutManager.setReverseLayout(true);
        final CacheListAdapter adapter = new CacheListAdapter(getContext());
        adapter.setClickListener(this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.scrollToPosition(recyclerView.getAdapter().getItemCount() -1);


        // Get a new or existing ViewModel from the ViewModelProvider.
        mPhraseViewModel = new ViewModelProvider(this).get(CacheViewModel.class);

        mPhraseViewModel.getAllPhrases().observe(this, new Observer<List<Cache>>() {
            @Override
            public void onChanged(@Nullable final List<Cache> phrases) {
                // Update the cached copy of the words in the adapter.
                adapter.setPhrases(phrases);
            }
        });

    }


}
