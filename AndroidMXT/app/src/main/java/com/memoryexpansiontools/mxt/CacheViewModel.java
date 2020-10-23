package com.memoryexpansiontools.mxt;

import android.app.Application;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import java.util.List;

public class CacheViewModel extends AndroidViewModel {

    private CacheRepository mRepository;
    private ServerAdapter server;
    private LiveData<List<Cache>> mAllPhrases;
    private LiveData<Cache> mSelectedPhrase;

    public CacheViewModel (Application application) {
        super(application);
        mRepository = new CacheRepository(application);
        server = new ServerAdapter(application.getApplicationContext());
        mAllPhrases = mRepository.getmAllPhrases();
    }

    LiveData<List<Cache>> getAllPhrases() {return mAllPhrases;}
    LiveData<Cache> getPhrase(int id) {return mRepository.getPhrase(id);}

    public void addPhrase(String word, String medium) {
        //pass
    }
}
