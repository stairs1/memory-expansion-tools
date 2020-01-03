package com.example.samdroid;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class SendAllPhrases extends AsyncTask<Context, Void, Void> {
    public static final String LOG_TAG = SendAllPhrases.class.getSimpleName();

    @Override
    protected Void doInBackground(Context... contexts) {
        Map<String, String> phrase_time_pairs = new HashMap<String, String>();
        File phrase_storage = new File(contexts[0].getApplicationContext().getFilesDir(), Conversation.PHRASE_STORAGE_FILENAME);
        try (BufferedReader br = new BufferedReader(new FileReader(phrase_storage))) {
            Log.d(LOG_TAG, "reading from file");
            String line;
            JSONArray phrases = new JSONArray();
            while ((line = br.readLine()) != null) {
                String[] stuff = line.split(":", 2);
                phrase_time_pairs.put(stuff[0], stuff[1]);
                JSONObject phrase_time = new JSONObject();
                phrase_time.put("timestamp", stuff[0]);
                phrase_time.put("speech", stuff[1]);
                phrases.put(phrase_time);
            }
            JSONObject json = new JSONObject();
            json.put("userId", MainActivity.USER_ID);
            json.put("type", "talk");
            json.put("phrases", phrases);
            SendUDP.send_json(json);
            Log.d(LOG_TAG, "--------------sent the following json------------");
            Log.d(LOG_TAG, json.toString());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return null;
    }
}
