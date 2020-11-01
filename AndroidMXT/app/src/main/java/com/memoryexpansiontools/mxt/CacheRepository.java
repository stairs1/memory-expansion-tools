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

public class CacheRepository {
    private CacheDao mPhraseDao;
    private LiveData<List<Cache>> mAllPhrases;

    CacheRepository(Application application) {
        CacheRoomDatabase db = CacheRoomDatabase.getDatabase(application);
        mPhraseDao = db.cacheDao();
        mAllPhrases = mPhraseDao.getAllPhrases();
    }

    LiveData<List<Cache>> getmAllPhrases() {
        return mAllPhrases;
    }

    long insert(Cache phrase) {
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
        CacheRoomDatabase.databaseWriteExecutor.execute(() -> {
            mPhraseDao.update(id, location, address);
        });
    }

    void deleteAll() {
        CacheRoomDatabase.databaseWriteExecutor.execute(() -> {
            mPhraseDao.deleteAll();
        });
    }

    LiveData<Cache> getPhrase(int id) {
        return mPhraseDao.get_by_id(id);
    }
}
