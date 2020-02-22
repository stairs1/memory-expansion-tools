package com.example.jetpacksam;

import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

import java.time.Instant;

public class NewPhraseActivity extends AppCompatActivity {

    public static final String EXTRA_WORD = "com.example.android.phraselistsql.WORD";
    public static final String EXTRA_TIME = "com.example.android.phraselistsql.TIME";

    private EditText mEditPhraseView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_phrase);
        mEditPhraseView = findViewById(R.id.edit_phrase);

        final Button button = findViewById(R.id.button_save);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent replyIntent = new Intent();
                if (TextUtils.isEmpty(mEditPhraseView.getText())) {
                    setResult(RESULT_CANCELED, replyIntent);
                } else {
                    String word = mEditPhraseView.getText().toString();
                    String time = Instant.now().toString();
                    replyIntent.putExtra(EXTRA_WORD, word);
                    replyIntent.putExtra(EXTRA_TIME, time);
                    setResult(RESULT_OK, replyIntent);
                }
                finish();
            }
        });
    }
}
