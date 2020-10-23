package com.memoryexpansiontools.mxt;

import android.location.Location;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface CacheDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insert(Cache phrase);

    @Query("UPDATE CacheTable SET location = :location, address = :address WHERE id = :id")
    void update(long id, Location location, String address);

    @Query("DELETE FROM CacheTable")
    void deleteAll();

    @Query("SELECT * from CacheTable ORDER BY timestamp DESC")
    LiveData<List<Cache>> getAllPhrases();

    @Query("SELECT * FROM CacheTable WHERE ID = :id")
    LiveData<Cache> get_by_id(int id);
}
