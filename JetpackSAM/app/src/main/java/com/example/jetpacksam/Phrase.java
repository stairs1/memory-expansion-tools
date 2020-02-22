package com.example.jetpacksam;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "PhraseTable")
public class Phrase {

    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id")
    private int mID = 0;

    @NonNull
    @ColumnInfo(name = "phrase")
    private String mPhrase;

    @NonNull
    @ColumnInfo(name = "timestamp")
    private String mTimestamp;

    public Phrase(@NonNull String phrase, @NonNull String timestamp) {
        this.mPhrase = phrase;
        this.mTimestamp = timestamp;
    }

    public String getPhrase(){return this.mPhrase;}
    public String getTimestamp(){return this.mTimestamp;}
    public int getID(){return this.mID;}
    public void setID(int id){this.mID = id;}
}
