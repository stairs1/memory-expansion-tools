package com.example.jetpacksam;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PhraseListAdapter extends RecyclerView.Adapter<PhraseListAdapter.PhraseViewHolder> {
    private ItemClickListener clickListener;
    private final LayoutInflater mInflater;
    private List<Phrase> mPhrases; // Cached copy of phrases


    class PhraseViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        private final TextView phraseItemView;

        private PhraseViewHolder(View itemView) {
            super(itemView);
            phraseItemView = itemView.findViewById(R.id.textView);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View view){
            if(clickListener != null){
                clickListener.onClick(view, mPhrases.get(getAdapterPosition()));
            }
        }
    }

    public void setClickListener(ItemClickListener itemClickListener) {
        this.clickListener = itemClickListener;
    }

    PhraseListAdapter(Context context) { mInflater = LayoutInflater.from(context); }

    @Override
    public PhraseViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = mInflater.inflate(R.layout.recyclerview_item, parent, false);
        PhraseViewHolder holder = new PhraseViewHolder(itemView);
        return holder;
    }

    @Override
    public void onBindViewHolder(PhraseViewHolder holder, int position) {
        if (mPhrases != null) {
            Phrase current = mPhrases.get(position);
            Instant stamp = Instant.parse(current.getTimestamp());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("L-d hh:mma").withZone(ZoneId.systemDefault());
            holder.phraseItemView.setText(formatter.format(stamp) + " - " + current.getPhrase());
        } else {
            // Covers the case of data not being ready yet.
            holder.phraseItemView.setText("No Phrase");
        }
    }

    void setPhrases(List<Phrase> phrases){
        mPhrases = phrases;
        notifyDataSetChanged();
    }

    // getItemCount() is called many times, and when it is first called,
    // mPhrases has not been updated (means initially, it's null, and we can't return null).
    @Override
    public int getItemCount() {
        if (mPhrases != null)
            return mPhrases.size();
        else return 0;
    }
}