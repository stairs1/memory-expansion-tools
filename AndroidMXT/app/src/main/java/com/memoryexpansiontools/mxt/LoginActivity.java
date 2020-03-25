package com.memoryexpansiontools.mxt;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.google.android.material.snackbar.Snackbar;

public class LoginActivity extends Activity {
    Button cancel, login;
    EditText username, password;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);

        Context mContext = this.getApplicationContext();

        //setup buttons
        cancel = findViewById(R.id.cancel);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        ConstraintLayout loginLayout = (ConstraintLayout) findViewById(R.id.loginlayout);
        ServerAdapter server = new ServerAdapter(mContext);
        server.queue.addRequestFinishedListener(new RequestQueue.RequestFinishedListener<Object>() {
            @Override
            public void onRequestFinished(Request<Object> request) {
                //the following needs to occur when the request returns, not inline here
                //check if the user was successfully logged in
                SharedPreferences sharedPref = mContext.getSharedPreferences("mxt", Context.MODE_PRIVATE);
                String loggedIn = sharedPref.getString("token", "");
                String loggedInRefresh = sharedPref.getString("refreshtoken", "");
                //if the user was logged in successfully, finish
                if(!loggedIn.equals("null")){
                    finish();
                    //otherwise, display an alert indicating the login creds were invalid
                } else{
                    Snackbar snackbar = Snackbar
                            .make(loginLayout, "Your login credentials are invalid. Please try again.", Snackbar.LENGTH_LONG);
                    snackbar.show();
                }
            }
        });

        login =  findViewById(R.id.login);
        username = findViewById(R.id.username);
        username.requestFocus(); //focus on login text edit field
        password = findViewById(R.id.password);
        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //check if some creds are entered but not if they are valid
                if ((!username.getText().toString().equals("")) && (!password.getText().toString().equals(""))) {
                    //login the user to the server
                    server.login(username.getText().toString(), password.getText().toString());
                } else { //user hasn't entered anything as credentials
                    Snackbar snackbar = Snackbar
                            .make(loginLayout, "Please make sure both fields have been filled in.", Snackbar.LENGTH_LONG);
                    snackbar.show();
                }
            }
        });

        //the following needs to occur when the request returns, not inline here
        //check if the user was successfully logged in
        SharedPreferences sharedPref = mContext.getSharedPreferences("mxt", Context.MODE_PRIVATE);
        String loggedIn = sharedPref.getString("token", "");
        TextView loggedInMessageTextView = (TextView) findViewById(R.id.loggedInMessage);


        //check if the user is logged in
        if(com.memoryexpansiontools.mxt.MainActivity.loginCount <= 1){
            com.memoryexpansiontools.mxt.MainActivity.loginCount++;
            loggedInMessageTextView.setText("");
        } else if(!loggedIn.equals("null")) {
            loggedInMessageTextView.setText("You are already logged in. Logging in again will change the account you are logged in with.");
        } else {
            loggedInMessageTextView.setText("");
        }

    }
}
