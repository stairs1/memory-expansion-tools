package com.example.jetpacksam;

import android.app.Application;
import androidx.lifecycle.LiveData;

import java.util.List;

public class PhraseRepository {

    private PhraseDao mPhraseDao;
    private LiveData<List<Phrase>> mAllPhrases;

    PhraseRepository(Application application) {
        PhraseRoomDatabase db = PhraseRoomDatabase.getDatabase(application);
        mPhraseDao = db.phraseDao();
        mAllPhrases = mPhraseDao.getAllPhrases();
    }

    LiveData<List<Phrase>> getmAllPhrases() {
        return mAllPhrases;
    }

    void insert(Phrase phrase) {
        PhraseRoomDatabase.databaseWriteExecutor.execute(() -> {
            mPhraseDao.insert(phrase);
        });
    }

    LiveData<Phrase> getPhrase(int id) {
        return mPhraseDao.get_by_id(id);
    }
}
