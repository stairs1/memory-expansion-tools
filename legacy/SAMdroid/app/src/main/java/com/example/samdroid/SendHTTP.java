package com.example.samdroid;

import android.content.Context;

import android.content.SharedPreferences;
import android.content.res.Resources;
import android.util.Base64;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.stream.Stream;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;

public class SendHTTP {

    public static final String LOG_TAG = SendHTTP.class.getSimpleName();
    public static OutputStream out = null;
    public static String urlString = "";


	private static JSONObject sendPost(String data, Context mContext, String endpoint) throws IOException
		{

			URL url = new URL(urlString + endpoint);
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();


			//get token for auth
            String token;
            if (endpoint == "refresh"){
                token = getToken(mContext, false);
            }
            else {
                token = getToken(mContext, true);
            }

			// JWT authentication header
			String jwtToken = "Bearer " + token;
			conn.setRequestProperty("Authorization", jwtToken);

			// set Timeout and method
			conn.setReadTimeout(7000);
			conn.setConnectTimeout(7000);
			conn.setRequestMethod("POST");
			conn.setDoInput(true);
            conn.setRequestProperty("Content-Type", "application/json");
			
            // add data to our post
            out = new BufferedOutputStream(conn.getOutputStream());

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
            writer.write(data);
            writer.flush();
            writer.close();
            out.close();
			
            //connect to server
            conn.connect();

            int code = conn.getResponseCode();

            if ((code == 401) && (endpoint != "refresh")){
                refresh(mContext);
                Log.d(LOG_TAG, "********************************refresh run here************");
                return sendPost(data, mContext, endpoint); //we have to make the request again after jwt token has refreshed
            }
            else {

                String result = new String();
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    result += inputLine;
                }
                Log.d(LOG_TAG, result);
                try {
                    JSONObject resp = new JSONObject(result);
                    return resp;
                } catch (JSONException e) {
                    Log.d(LOG_TAG, e.toString());
                }

                return null;
            }

		}
    
	public static void send_phrase(String phrase_string, Context mContext) {

        Log.d(LOG_TAG, "send_phrase(HTTP) " + phrase_string);

        long unixTime = System.currentTimeMillis() / 1000L;

        JSONObject json = new JSONObject();
        JSONArray phrases = new JSONArray();
        JSONObject phrase_json = new JSONObject();

        try {
            phrase_json.put("timestamp", unixTime);
            phrase_json.put("speech", phrase_string);
            phrases.put(phrase_json);
            json.put("userId", "null");
            json.put("type", "phrasing");
            json.put("phrases", phrases);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        try {
            sendPost(json.toString(), mContext, "remember");
        } catch (IOException e){
            Log.d(LOG_TAG, e.toString());
        }
    }

    public static String login(String userName, String password, Context mContext) {

        Log.d(LOG_TAG, "login(HTTP) " + userName + password);

        JSONObject json = new JSONObject();

        try {
            json.put("userId", userName);
            json.put("password", password);
            JSONObject resp = sendPost(json.toString(), mContext, "");
            SharedPreferences sharedPref = mContext.getSharedPreferences("samPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("token", resp.getString("token"));
            editor.putString("refreshToken", resp.getString("refreshToken"));
            editor.commit();
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (IOException d) {
            Log.d(LOG_TAG, d.toString());
        }

        return null;


    }

    public static String getToken(Context mContext, Boolean choice){
        String token;
        String name;
        if (choice) {
            name = "token";
        } else {
            name = "refreshToken";
        }

        SharedPreferences sharedPref = mContext.getSharedPreferences(
                "samPrefs", Context.MODE_PRIVATE);
        token = sharedPref.getString(name, "null");
        Log.d(LOG_TAG, "******** SendHTTP TOKEN ISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS" + token);
        return token;
    }

    public static void refresh(Context mContext){
        try {
            JSONObject resp = sendPost("", mContext, "refresh");
            String newToken = resp.getString("token");
            SharedPreferences sharedPref = mContext.getSharedPreferences("samPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("token", newToken);
            editor.commit();
        } catch(IOException e){
            Log.d(LOG_TAG, e.toString());
        } catch (JSONException e){
            Log.d(LOG_TAG, e.toString());
        }
    }
    
}
//post onto /remember
