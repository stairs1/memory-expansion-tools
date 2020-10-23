package com.memoryexpansiontools.mxt;

import android.content.Context;
import android.location.Location;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Database;
import androidx.room.PrimaryKey;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;
import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;

import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Database(entities = {Cache.class}, version = 1, exportSchema = false)
@TypeConverters({Converters.class})
public abstract class CacheRoomDatabase extends RoomDatabase {

    public abstract CacheDao cacheDao();
    private static volatile com.memoryexpansiontools.mxt.CacheRoomDatabase INSTANCE;
    private static final int NUMBER_OF_THREADS = 4;
    static final ExecutorService databaseWriteExecutor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    static com.memoryexpansiontools.mxt.CacheRoomDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (com.memoryexpansiontools.mxt.CacheRoomDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(), com.memoryexpansiontools.mxt.CacheRoomDatabase.class, "cache_database")
                            .build();
                            //.addMigrations((MIGRATION_1_2)).build();
                }
            }
        }
        return INSTANCE;
    }

    //needed to upgrade new users from old version to new version with Cache room database
    static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `CacheTable` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `phrase` TEXT NOT NULL, `timestamp` INTEGER NOT NULL, `medium` TEXT NOT NULL, `location` TEXT, `address` TEXT)");
        }
    };
}
