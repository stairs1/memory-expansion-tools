package com.memoryexpansiontools.mxt;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.google.android.material.snackbar.Snackbar;

public class LoginActivity extends Fragment {
    Button cancel, login;
    EditText username, password;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragmen
        return inflater.inflate(R.layout.login_fragment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getActivity().setContentView(R.layout.login_fragment);

        Context mContext = getContext();

        //setup buttons
        cancel = view.findViewById(R.id.cancel);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //navigate back to stream upon sign in
                final NavController navController = Navigation.findNavController(getActivity(), R.id.nav_host_fragment);
                navController.navigate(R.id.nav_stream);
            }
        });

        ConstraintLayout loginLayout = (ConstraintLayout) view.findViewById(R.id.loginlayout);
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
                    Snackbar snackbar = Snackbar
                            .make(loginLayout, "Sign in success.", Snackbar.LENGTH_SHORT);
                    final NavController navController = Navigation.findNavController(getActivity(), R.id.nav_host_fragment);
                    navController.navigate(R.id.nav_stream);
                    //otherwise, display an alert indicating the login creds were invalid
                } else{
                    Snackbar snackbar = Snackbar
                            .make(loginLayout, "Your login credentials are invalid. Please try again.", Snackbar.LENGTH_LONG);
                    snackbar.show();
                }
            }
        });

        login =  view.findViewById(R.id.login);
        username = view.findViewById(R.id.username);
        username.requestFocus(); //focus on login text edit field
        password = view.findViewById(R.id.password);
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
        TextView loggedInMessageTextView = (TextView) view.findViewById(R.id.loggedInMessage);


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

