package com.example.jetpacksam;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

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
                //check if some creds are entered
                if ((username.getText().toString() != null) && (password.getText().toString() != null)) {
                    //login the user to the server
                    ServerAdapter server = new ServerAdapter(mContext);
                    server.login(username.getText().toString(), password.getText().toString());
                    finish();
                } else { //user hasn't entered correct credentials
                    Log.d("cayden", "didn't enter stuff for login");
                }
            }
        });
    }
}
