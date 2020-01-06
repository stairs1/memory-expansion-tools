//package com.example.samdroid;
//
//import androidx.lifecycle.LiveData;
//import androidx.room.Dao;
//import androidx.room.Insert;
//import androidx.room.OnConflictStrategy;
//import androidx.room.Query;
//
//import java.util.List;
//
//@Dao
//public interface PhraseDao {
//
//    @Insert(onConflict = OnConflictStrategy.REPLACE)
//    void insert(Phrase phrase);
//
//    @Query("SELECT * FROM phrase_table WHERE on_server==0")
//    LiveData<List<Phrase>> getUnsyncedPhrases();
//
//    @Query("SELECT * FROM phrase_table")
//    LiveData<List<Phrase>> getAllPhrases();
//}
