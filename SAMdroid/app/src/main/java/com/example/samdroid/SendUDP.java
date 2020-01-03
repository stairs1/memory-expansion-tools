package com.example.samdroid;


import android.util.Log;
import org.json.JSONObject;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class SendUDP {
    public static final int SERVER_PORT = 5005;
    public static InetAddress inet_addr;
    public static byte[] address = {(byte) 192, (byte) 168, (byte) 0, (byte) 22};
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

    public static String send(String message) {

        Long unixTime = System.currentTimeMillis() / 1000;
        Double time2 = unixTime + 0.01;
        String groomed_message = "{\"speech\": \"" + message + "\", \"start\": " + unixTime.toString() + ", \"end\": " + time2.toString() + "}";


        if (send_help(groomed_message) == true) {
            return ("everything seemed to go ok");
        }
        else return("send failed");
    }

    public static void send_json(JSONObject json){
        Log.d(LOG_TAG, json.toString());
        send_help(json.toString());

    }

}
