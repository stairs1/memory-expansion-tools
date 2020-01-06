//package com.example.samdroid;
//
//import android.content.Context;
//import android.security.keystore.KeyInfo;
//import androidx.annotation.NonNull;
//import androidx.room.Database;
//import androidx.room.Room;
//import androidx.room.RoomDatabase;
//import androidx.sqlite.db.SupportSQLiteDatabase;
//
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//
//@Database(entities = {Phrase.class}, version=1)
//public abstract class PhraseRoomDatabase extends RoomDatabase {
//    public abstract PhraseDao phraseDao();
//
//    private static volatile PhraseRoomDatabase INSTANCE;
//    private static final int NUM_THREADS = 4;
//    static final ExecutorService databaseWriteExecutor = Executors.newFixedThreadPool(NUM_THREADS);
//
//    static PhraseRoomDatabase getDatabase(final Context context){
//        if(INSTANCE == null){
//            synchronized (PhraseRoomDatabase.class){
//                if(INSTANCE == null){
//                    INSTANCE = Room.databaseBuilder(
//                            context.getApplicationContext(),
//                            PhraseRoomDatabase.class,
//                            "phrase_database"
//                    ).addCallback(roomdbCallback).build();
//                }
//            }
//        }
//        return INSTANCE;
//    }
//
////    private static RoomDatabase.Callback roomdbCallback = new RoomDatabase.Callback(){
////
////        @Override
////        public void onOpen(@NonNull SupportSQLiteDatabase db){
////            super.onOpen(db);
////
////            databaseWriteExecutor.execute(() -> {
////                PhraseDao dao = INSTANCE.phraseDao();
////                Double timestamp = 123455667.1;
////                Phrase phrase = new Phrase("bobs test phrase", timestamp, false);
////                dao.insert(phrase);
////
////            });
////        }
////    }
//}
