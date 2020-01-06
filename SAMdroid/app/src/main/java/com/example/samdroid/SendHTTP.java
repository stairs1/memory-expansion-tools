package com.example.samdroid;

import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.stream.Stream;

public class SendHTTP {

    public static final String LOG_TAG = SendHTTP.class.getSimpleName();
    public static String urlString = "http://192.168.0.20:5000/remember";
//    public static String urlString = "http://wearcam.org/";
    public static OutputStream out = null;
    public static InputStream in = null;

    public static void send_help(String data) {
        try {
            URL url = null;
            url = new URL(urlString);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//            out = new BufferedOutputStream(urlConnection.getOutputStream());
//
//            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
//            writer.write(data);
//            writer.flush();
//            writer.close();
//            out.close();

            in = new BufferedInputStream(urlConnection.getInputStream());

            BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String stuff = reader.readLine();
            Log.d(LOG_TAG, stuff);
            reader.close();
            in.close();

//            urlConnection.connect();
        } catch (Exception e) {
            Log.d(LOG_TAG, e.toString());
            System.out.println(e.getMessage());
        }
    }


    public static void send_phrase(String phrase_string) {

        Log.d(LOG_TAG, "send_phrase(HTTP) " + phrase_string);
        Long unixTime = System.currentTimeMillis() / 1000;

        JSONObject json = new JSONObject();
        JSONArray phrases = new JSONArray();
        JSONObject phrase_json = new JSONObject();

        try {
            phrase_json.put("timestamp", unixTime);
            phrase_json.put("speech", phrase_string);
            phrases.put(phrase_json);
            json.put("userId", MainActivity.USER_ID);
            json.put("type", "phrasing");
            json.put("phrases", phrases);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        send_help(json.toString());
    }}
//post onto /remember