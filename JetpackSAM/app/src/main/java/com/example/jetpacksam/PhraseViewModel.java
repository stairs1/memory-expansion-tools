package com.example.jetpacksam;

import android.app.Application;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import java.util.List;

public class PhraseViewModel extends AndroidViewModel {

    private PhraseRepository mRepository;
    private LiveData<List<Phrase>> mAllPhrases;
    private LiveData<Phrase> mSelectedPhrase;

    public PhraseViewModel (Application application) {
        super(application);
        mRepository = new PhraseRepository(application);
        mAllPhrases = mRepository.getmAllPhrases();
    }

    LiveData<List<Phrase>> getAllPhrases() {return mAllPhrases;}
    LiveData<Phrase> getPhrase(int id) {return mRepository.getPhrase(id);}

    public void insert(Phrase phrase) { mRepository.insert(phrase);}
}
