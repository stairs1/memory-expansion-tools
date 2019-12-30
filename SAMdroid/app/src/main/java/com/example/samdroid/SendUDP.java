package com.example.samdroid;


import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class SendUDP {
    public static final int SERVER_PORT = 5005;
    public static InetAddress inet_addr;


    public static String send(String message) {

        Long unixTime = System.currentTimeMillis() / 1000;
        Double time2 = unixTime + 0.01;
        DatagramSocket ds = null;
        String groomed_message = "{\"speech\": \"" + message + "\", \"start\": " + unixTime.toString() + ", \"end\": " + time2.toString() + "}";

        byte[] address = {(byte) 192, (byte) 168, (byte) 0, (byte) 22};
        try {
            inet_addr = InetAddress.getByAddress(address);
        } catch (UnknownHostException e) {
            return e.toString();
        }


        try {
            ds = new DatagramSocket();
            DatagramPacket dp;
            dp = new DatagramPacket(groomed_message.getBytes(), groomed_message.length(), inet_addr, SERVER_PORT);
            ds.setBroadcast(true);
            ds.send(dp);
        } catch (Exception e) {
            return e.toString();
        } finally {
            if (ds != null) {
                ds.close();
            }
        }
        return("everything seemed to go ok");
    }

}
