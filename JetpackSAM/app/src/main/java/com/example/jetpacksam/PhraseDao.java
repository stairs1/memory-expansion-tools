package com.example.jetpacksam;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface PhraseDao {

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    void insert(Phrase phrase);

    @Update
    void update(Phrase phrase);

    @Query("DELETE FROM PhraseTable")
    void deleteAll();

    @Query("SELECT * from PhraseTable ORDER BY timestamp DESC")
    LiveData<List<Phrase>> getAllPhrases();

    @Query("SELECT * FROM PhraseTable WHERE ID = :id")
    LiveData<Phrase> get_by_id(int id);
}
