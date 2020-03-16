package com.example.jetpacksam;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.util.Log;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.Task;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class PhraseCreator {
    public static final String LOG_TAG = PhraseCreator.class.getName();

    public static void create(String words, String medium, Context context, PhraseRepository repo, ServerAdapter server) {
        /*
        Location may return right away or in a minute, null or not
        Because of this, insert each phrase without location synchronously, and after getting id back
            get location and update the phrase with location results whenever they arrive.
        For now send to server once location returns, because less time sensitive and simpler than duplicates.
         */

        Date time = new Date();
        Geocoder geocoder = new Geocoder(context, Locale.getDefault());
        Phrase phrase = new Phrase(words, time, medium);
        long id = repo.insert(phrase);  // This insert blocks until database write has completed

        // Using getLastLocation is not always totally accurate. Good to update this at some point.
        FusedLocationProviderClient fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
        Task<Location> task = fusedLocationClient.getLastLocation();
        task.addOnSuccessListener(location -> {
            if(location != null) {
                String address = null;
                phrase.setLocation(location);

                List<Address> addresses = null;
                try {
                    addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
                    if(addresses.size() > 0){
                        address = addresses.get(0).getAddressLine(0);
                        phrase.setAddress(address);
                    }
                    else {
                        Log.d(LOG_TAG, "no address found, omitting");
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    Log.d(LOG_TAG, "no address found, omitting");
                }
                Log.d(LOG_TAG, "phrase: " + words + ", " + "time: " + time.getTime() + " lat: " + location.getLatitude() + " lon: " + location.getLongitude() + " address: " + address);
                repo.update(id, location, address);
            }
            else{
                Log.d(LOG_TAG, "location returned null, sending phrase without location");
            }
            server.sendPhrase(phrase);
        });
    }
}
