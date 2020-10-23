package com.memoryexpansiontools.mxt;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class TagsFragment extends Fragment {

    public static final int NEW_PHRASE_ACTIVITY_REQUEST_CODE = 1;
    public static final int VIEW_PHRASE_ACTIVITY_REQUEST_CODE = 2;
    public static final int SETTINGS_ACTIVITY_REQUEST_CODE = 2;
    public static final int LOGIN_ACTIVITY_REQUEST_CODE = 3;
    public static final int CACHE_ACTIVITY_REQUEST_CODE = 4; //I don't know what these are for yet but this looks cool

    private ServerAdapter server;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragmen
        return inflater.inflate(R.layout.tags_fragment, container, false);
    }

    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //create the server adapter and fetch the cache
        server = new ServerAdapter(this.getContext());
        server.getTags();
    }


}