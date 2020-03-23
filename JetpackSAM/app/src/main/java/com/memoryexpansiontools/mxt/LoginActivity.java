package com.example.jetpacksam;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

import org.json.JSONException;

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

        login =  findViewById(R.id.login);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //check if some creds are entered but not if they are valid
                if ((username.getText().toString() != "") && (password.getText().toString() != "")) {
                    //login the user to the server
                    ServerAdapter server = new ServerAdapter(mContext);
                    server.login(username.getText().toString(), password.getText().toString());


                    //check if the user was successfully logged in
                    SharedPreferences sharedPref = server.lcontext.getSharedPreferences("mxt", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPref.edit();
                    String loggedIn = sharedPref.getString("token", "");
                    String loggedInRefresh = sharedPref.getString("refreshtoken", "");
                    CoordinatorLayout loginLayout = (CoordinatorLayout) findViewById(R.id.loginLayout);
                    //if the user was logged in successfully, finish
                    if(loggedIn != null){
                        finish();
                        //otherwise, display an alert indicating the login creds were invalid
                    } else{
                        Snackbar snackbar = Snackbar
                                .make(loginLayout, "Your login credentials are invalid. Please try again.", Snackbar.LENGTH_LONG);
                        snackbar.show();
                    }
                } else { //user hasn't entered anything as credentials
                }
            }
        });
    }
}
