package com.example.jetpacksam;

import android.location.Address;
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

    @ColumnInfo(name = "address")
    private String mAddress;

    public Phrase(@NonNull String phrase, @NonNull Date timestamp, Location location, String address) {
        this.mPhrase = phrase;
        this.mTimestamp = timestamp;
        this.mLocation = location;
        this.mAddress = address;
    }

    public String getPhrase(){return this.mPhrase;}
    public Date getTimestamp(){return this.mTimestamp;}
    public Location getLocation(){return this.mLocation;}
    public String getAddress(){return this.mAddress;}
    public int getID(){return this.mID;}
    public void setID(int id){this.mID = id;}
}
