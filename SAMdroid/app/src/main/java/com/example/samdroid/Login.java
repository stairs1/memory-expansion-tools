package com.example.samdroid;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

public class Login extends AsyncTask<Context, Void, Void> {
    public static final String LOG_TAG = SendAllPhrases.class.getSimpleName();
    private Context mContext;
    private String userName;
    private String password;

    public Login(Context context, String user, String pword){
        mContext = context;
        userName = user;
        password = pword;
    }
    @Override
    protected Void doInBackground(Context... contexts) {
            SendHTTP.login(userName, password, mContext);
            Log.d(LOG_TAG, "--------------sent the following json------------");
            Log.d(LOG_TAG, userName + ":" + password);


        return null;
    }
}
