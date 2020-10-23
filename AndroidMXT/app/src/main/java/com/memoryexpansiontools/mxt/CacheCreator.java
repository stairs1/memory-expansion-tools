package com.memoryexpansiontools.mxt;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.Task;
import com.google.gson.JsonArray;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class CacheCreator {
    public static final String LOG_TAG = CacheCreator.class.getName();

    public static void replace(JSONArray data, CacheRepository repo) {
        Log.d("cayden", "Updating Cache db");
        //first, clear all old cache entries from db
        repo.deleteAll();
        for (int i = 0; i < data.length(); i++) {
            try {
                JSONObject o = data.getJSONObject(i);
                Date mDate = new java.util.Date(o.getLong("timestamp"));
                Cache phrase = new Cache(o.getString("talk"), mDate, " ");
                long id = repo.insert(phrase);  // This insert blocks until database write has completed
            } catch (JSONException e){
                //pass
                Log.d("cayden", "JSON OBJECT EXPAITON CACHE CREATOR");
            }
        }
    }
}


