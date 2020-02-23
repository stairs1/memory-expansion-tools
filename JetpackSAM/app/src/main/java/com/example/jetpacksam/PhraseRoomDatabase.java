package com.example.jetpacksam;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.room.Dao;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverter;
import androidx.room.TypeConverters;
import androidx.sqlite.db.SupportSQLiteDatabase;

import java.util.Date;
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
                            .addCallback(sRoomDatabaseCallback)
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    private static RoomDatabase.Callback sRoomDatabaseCallback = new RoomDatabase.Callback() {
        @Override
        public void onOpen(@NonNull SupportSQLiteDatabase db) {
            super.onOpen(db);

            // If you want to keep data through app restarts,
            // comment out the following block
//            databaseWriteExecutor.execute(() -> {
//                // Populate the database in the background.
//                // If you want to start with more words, just add them.
//                PhraseDao dao = INSTANCE.phraseDao();
//                dao.deleteAll();
//
//                Phrase phrase = new Phrase("Hey hunny", new Date());
//                dao.insert(phrase);
//                Phrase phrase_2 = new Phrase("wan sum fuk?", new Date());
//                dao.insert(phrase_2);
//            });
//            String bob = "hey";
        }
    };
}
