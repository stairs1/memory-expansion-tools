package com.memoryexpansiontools.mxt;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.preference.PreferenceManager;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.snackbar.Snackbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

//adapter to communicate with the backend server, handles sign in, auth, sending talks
public class ServerAdapter {
    //TODO as we make more modalities (images, videos, etc) and implement more API class, we should make one volley JSON sender function, and just wrap that that with other functions to pass it in the right body and endpoint
    public RequestQueue queue;
    private Context lcontext;
    private String url;
    private int retry; //saves a number of retries, if this goes over three, we should stop trying to refresh the token
    //TODO warn user of login trouble if this var goes above three

    ServerAdapter(Context context) {
        // Instantiate the RequestQueue.
        lcontext = context;
        queue = Volley.newRequestQueue(lcontext);
        SharedPreferences sharedPreferences =
                PreferenceManager.getDefaultSharedPreferences(lcontext);
        url = sharedPreferences.getString("server_address", "https://memoryexpansiontools.com");
        retry = 0;
    }

    public void search(String query) {
        //get the current access token from sharedprefs
        String token = getToken(true);

        //url to hit for this api request
        String turl = url + "/api/searchapi";

        //to be sent
        JSONObject params = new JSONObject();

        //build phrase list (in this case, with just one phrase)
        //TODO make the backend accept one phrase simpler, without the whole nested JSON array thing
        try {
            JSONObject phraseNest = new JSONObject();
            phraseNest.put("speech", query);
            JSONArray phraseList = new JSONArray();
            phraseList.put(phraseNest);

            //specify parameters (info about the phrase
            params.put("time", 0);
            params.put("phrases", phraseList);
        } catch (JSONException e){
            e.printStackTrace();
        }

        // Request a json response from the provided URL.
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, turl, params,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Display the first 500 characters of the response string.
                        Log.d("cayden", "success searching");
                        Log.d("cayden", response.toString());
                        retry = 0;
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                Log.d("cayden", "^^^ failure searching");
                if (retry < 3) {
                    retry += 1;
                    refresh();
                    search(query);
                } else {
                }
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<>();
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };
        // Add the request to the RequestQueue.
        queue.add(request);
    }

    public void sendPhrase(Phrase phrase) {

        //first check if we are to be streaming to the server
        SharedPreferences sharedPreferences =
                PreferenceManager.getDefaultSharedPreferences(lcontext);
        Boolean serverOn = sharedPreferences.getBoolean("sync", false);
        if (!serverOn){
            return;
        }

        //get the current access token from sharedprefs
        String token = getToken(true);

        //url to hit for this api request
        String turl = url + "/api/remember";

        //to be sent
        JSONObject params = new JSONObject();

        //build phrase list (in this case, with just one phrase)
        //TODO make the backend accept one phrase simpler, without the whole nested JSON array thing
        try {
            JSONObject phraseNest = new JSONObject();
            phraseNest.put("speech", phrase.getPhrase());
            phraseNest.put("timestamp", phrase.getTimestamp().getTime()/1000);
            JSONArray phraseList = new JSONArray();
            phraseList.put(phraseNest);

            //specify parameters (info about the phrase
            params.put("type", "phrase");
            params.put("phrases", phraseList);
            if (phrase.getAddress() != null) {
                params.put("lat", phrase.getLocation().getLatitude());
                params.put("long", phrase.getLocation().getLongitude());
                params.put("address", phrase.getAddress());
                params.put("phrases", phraseList);
            }
        } catch (JSONException e){
            e.printStackTrace();
        }

        // Request a json response from the provided URL.
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, turl, params,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Display the first 500 characters of the response string.
                        retry = 0;
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                if (retry < 3) {
                    retry += 1;
                    refresh();
                    sendPhrase(phrase);
                } else {
                }
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<>();
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };
        // Add the request to the RequestQueue.
        queue.add(request);
    }

    public void login(String user, String pass){
        String turl = url + "/api/loginapi";
        //build login params body
        JSONObject params = new JSONObject();
        try {
            params.put("userId", user);
            params.put("password", pass);
        } catch (JSONException e ) {
            e.printStackTrace();
        }

        // Request a json response from the provided URL.
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, turl, params,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Display the first 500 characters of the response string.

                        //store the token into shared preferences
                        SharedPreferences sharedPref = lcontext.getSharedPreferences("mxt", Context.MODE_PRIVATE);
                        SharedPreferences.Editor editor = sharedPref.edit();
                        try {
                            editor.putString("token", response.getString("token"));
                            editor.putString("refreshToken", response.getString("refreshToken"));
                            editor.commit();
                        } catch (JSONException e){
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });
        // Add the request to the RequestQueue.
        queue.add(request);
    }

    private String getToken(Boolean choice){
        String token;
        String name;
        if (choice) {
            name = "token";
        } else {
            name = "refreshToken";
        }

        SharedPreferences sharedPref = lcontext.getSharedPreferences(
                "mxt", Context.MODE_PRIVATE);
        token = sharedPref.getString(name, "null");
        return token;
    }

    private void refresh(){
        String token = getToken(false); //get the stored refresh token
        String turl = url + "/api/refresh";

        // Request a json response from the provided URL.
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, turl, new JSONObject(),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Display the first 500 characters of the response string.
                        try {
                            //store the new token into our shared preferences
                            String newToken = response.getString("token");
                            SharedPreferences sharedPref = lcontext.getSharedPreferences("mxt", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putString("token", newToken);
                            editor.commit();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        })
            {
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<>();
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };
        // Add the request to the RequestQueue.
        queue.add(request);

    }


    public void getCache(Application lapp) {
        String turl = url + "/api/ltwo";
        //get the current access token from sharedprefs
        String token = getToken(true);

        // Request a string response from the provided URL.
            JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, turl, new JSONObject(),
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.d("cayden", "cache fetch success");
                        Log.d("cayden", response.toString());
                        CacheCreator cacheCreator = new CacheCreator();
                        CacheRepository cRepo = new CacheRepository(lapp);
                        cacheCreator.replace(response, cRepo); //replace the existing cache with this newly updated cache
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("cayden", "cache fetch fail");
                error.printStackTrace();
                if (retry < 3) {
                    retry += 1;
                    refresh();
                    getCache(lapp);
                }
            }
        }){
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    HashMap<String, String> headers = new HashMap<>();
                    headers.put("Authorization", "Bearer " + token);
                    return headers;
                }
            };

        // Add the request to the RequestQueue.
        queue.add(request);
    }

    public void getTags() {
        String turl = url + "/api/tag";
        //get the current access token from sharedprefs
        String token = getToken(true);

        // Request a string response from the provided URL.
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, turl, new JSONObject(),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        retry = 0;
                        Log.d("cayden", "tag fetch success");
                        Log.d("cayden", response.toString());
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("cayden", "tag fetch fail");
                error.printStackTrace();
                if (retry < 3) {
                    retry += 1;
                    refresh();
                    getTags();
                }
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<>();
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }
        };

        // Add the request to the RequestQueue.
        queue.add(request);
    }

}
