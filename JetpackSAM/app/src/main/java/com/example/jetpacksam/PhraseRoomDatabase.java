package com.example.jetpacksam;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Database(entities = {Phrase.class}, version = 1, exportSchema = false)
@TypeConverters({Converters.class})
public abstract class PhraseRoomDatabase extends RoomDatabase {

    public abstract PhraseDao phraseDao();
    private static volatile PhraseRoomDatabase INSTANCE;
    private static final int NUMBER_OF_THREADS = 4;
    static final ExecutorService databaseWriteExecutor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    static PhraseRoomDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (PhraseRoomDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(), PhraseRoomDatabase.class, "phrase_database")
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
