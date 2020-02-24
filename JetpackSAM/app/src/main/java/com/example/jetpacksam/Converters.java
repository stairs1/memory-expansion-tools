package com.example.jetpacksam;

import android.location.Address;
import android.location.Location;
import android.location.LocationManager;

import androidx.room.TypeConverter;

import com.google.gson.Gson;

import java.util.Date;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.Locale;

public class Converters {

    @TypeConverter
    public static Date fromTimestamp(Long value){
        return value == null ? null : new Date(value);
    }

    @TypeConverter
    public static long toTimestamp(Date time){
        return time == null ? null : time.getTime();
    }

    @TypeConverter
    public static Location fromLocation(String value){
        Gson gson = new Gson();
        Hashtable stash = gson.fromJson(value, Hashtable.class);
        Location location = new Location(LocationManager.GPS_PROVIDER);
        location.setLatitude((Double)stash.get("lat"));
        location.setLongitude((Double)stash.get("lon"));
        location.setAltitude((Double)stash.get("altitude"));
        return value == null ? null : location;
    }

    @TypeConverter
    public static String toLocation(Location location){
        Dictionary stash = new Hashtable();
        stash.put("lat", location.getLatitude());
        stash.put("lon", location.getLongitude());
        stash.put("altitude", location.getAltitude());
        Gson gson = new Gson();
        return location == null ? null : gson.toJson(stash);
    }

//    @TypeConverter
//    public static Address fromAddress(String value){
//        return value == null ? null : new Address(Locale.getDefault());
//    }
//
//    @TypeConverter
//    public static String toAddress(Address address){
//        return address == null ? null : address.getAddressLine(0);
//    }

}
