package com.example.jetpacksam;

import android.location.Location;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.util.Date;

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
    private Date mTimestamp;

    @ColumnInfo(name = "location")
    private Location mLocation;

    public Phrase(@NonNull String phrase, @NonNull Date timestamp, Location location) {
        this.mPhrase = phrase;
        this.mTimestamp = timestamp;
        this.mLocation = location;
    }

    public String getPhrase(){return this.mPhrase;}
    public Date getTimestamp(){return this.mTimestamp;}
    public Location getLocation(){return this.mLocation;}
    public int getID(){return this.mID;}
    public void setID(int id){this.mID = id;}
}
