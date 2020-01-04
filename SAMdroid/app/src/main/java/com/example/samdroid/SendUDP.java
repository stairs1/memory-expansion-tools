package com.example.samdroid;


import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class SendUDP {
    public static final int SERVER_PORT = 5005;
    public static InetAddress inet_addr;
    public static byte[] address = {(byte) 192, (byte) 168, (byte) 0, (byte) 19};
    public static final String LOG_TAG = SendUDP.class.getSimpleName();

    private static boolean send_help(String to_send){
        DatagramSocket ds = null;
        try {
            inet_addr = InetAddress.getByAddress(address);
            ds = new DatagramSocket();
            DatagramPacket dp;
            dp = new DatagramPacket(to_send.getBytes(), to_send.length(), inet_addr, SERVER_PORT);
            ds.setBroadcast(true);
            ds.send(dp);
        } catch (Exception e) {
            Log.d(LOG_TAG, "send udp failed");
            Log.d(LOG_TAG, e.toString());
            return false;
        } finally {
            if (ds != null) {
                ds.close();
            }
        }
        return true;
    }

    public static void send_phrase(String phrase_string) {

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
    }

    public static void send_json(JSONObject json){
        Log.d(LOG_TAG, json.toString());
        send_help(json.toString());

    }

}
