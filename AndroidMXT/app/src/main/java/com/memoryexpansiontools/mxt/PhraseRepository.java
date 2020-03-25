package com.memoryexpansiontools.mxt;

import android.app.Application;
import android.location.Location;

import androidx.lifecycle.LiveData;

import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

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

    long insert(Phrase phrase) {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        Callable<Long> insertCallable = () -> mPhraseDao.insert(phrase);
        Future<Long> future = executorService.submit(insertCallable);
        long rowId = 0;
        try{
            rowId = future.get();
        }
        catch (InterruptedException | ExecutionException e){
            e.printStackTrace();
        }
        return rowId;
    }

    void update(long id, Location location, String address) {
        PhraseRoomDatabase.databaseWriteExecutor.execute(() -> {
            mPhraseDao.update(id, location, address);
        });
    }

    LiveData<Phrase> getPhrase(int id) {
        return mPhraseDao.get_by_id(id);
    }
}
