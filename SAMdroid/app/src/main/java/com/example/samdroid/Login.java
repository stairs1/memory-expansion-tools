package com.example.samdroid;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import org.apache.commons.lang3.StringUtils;

public class Login extends AsyncTask<Context, Void, Void> {
    public static final String LOG_TAG = SendAllPhrases.class.getSimpleName();
    private Context mContext;
    private String userName;
    private String password;
    private String customServer;

    public Login(Context context, String user, String pword, String cServer){
        mContext = context;
        userName = user;
        password = pword;
        customServer = cServer;
        if(!StringUtils.isBlank(customServer)){
            SendHTTP.urlString = customServer;
            Log.d(LOG_TAG, "using custom server at " + customServer);
        }
        else {
            SendHTTP.urlString = context.getResources().getString(R.string.default_server);
            Log.d(LOG_TAG, "using default server at " + SendHTTP.urlString);
        }
    }
    @Override
    protected Void doInBackground(Context... contexts) {
            SendHTTP.login(userName, password, mContext);
            Log.d(LOG_TAG, "--------------sent the following json------------");
            Log.d(LOG_TAG, userName + ":" + password);


        return null;
    }
}
