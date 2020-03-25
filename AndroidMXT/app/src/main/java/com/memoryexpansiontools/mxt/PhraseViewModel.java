package com.memoryexpansiontools.mxt;

import android.app.Application;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import java.util.List;

public class PhraseViewModel extends AndroidViewModel {

    private PhraseRepository mRepository;
    private ServerAdapter server;
    private LiveData<List<Phrase>> mAllPhrases;
    private LiveData<Phrase> mSelectedPhrase;

    public PhraseViewModel (Application application) {
        super(application);
        mRepository = new PhraseRepository(application);
        server = new ServerAdapter(application.getApplicationContext());
        mAllPhrases = mRepository.getmAllPhrases();
    }

    LiveData<List<Phrase>> getAllPhrases() {return mAllPhrases;}
    LiveData<Phrase> getPhrase(int id) {return mRepository.getPhrase(id);}

    public void addPhrase(String word, String medium) {
        PhraseCreator.create(word, medium, getApplication().getApplicationContext(), mRepository, server);
    }
}
