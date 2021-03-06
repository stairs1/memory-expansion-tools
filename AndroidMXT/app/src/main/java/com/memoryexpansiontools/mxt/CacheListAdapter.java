package com.memoryexpansiontools.mxt;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.text.SimpleDateFormat;
import java.util.List;

public class CacheListAdapter extends RecyclerView.Adapter<CacheListAdapter.CacheViewHolder> {
    private ItemClickListener clickListener;
    private final LayoutInflater mInflater;
    private List<Cache> mPhrases; // Cached copy of phrases


    class CacheViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        private final TextView phraseItemView;

        private CacheViewHolder(View itemView) {
            super(itemView);
            phraseItemView = itemView.findViewById(R.id.textView);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View view){
//            if(clickListener != null){
//                clickListener.onClick(view, mPhrases.get(getAdapterPosition()));
//            }
        }
    }

    public void setClickListener(ItemClickListener itemClickListener) {
        this.clickListener = itemClickListener;
    }

    CacheListAdapter(Context context) { mInflater = LayoutInflater.from(context); }

    @Override
    public CacheViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = mInflater.inflate(R.layout.recyclerview_item, parent, false);
        CacheViewHolder holder = new CacheViewHolder(itemView);
        return holder;
    }

    @Override
    public void onBindViewHolder(CacheViewHolder holder, int position) {
        if (mPhrases != null) {
            Cache current = mPhrases.get(position);
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("L-d hh:mma").withZone(ZoneId.systemDefault());
            SimpleDateFormat formatski = new SimpleDateFormat("L-d hh:mma");
            holder.phraseItemView.setText(formatski.format(current.getTimestamp()) + " - " + current.getPhrase());
        } else {
            // Covers the case of data not being ready yet.
            holder.phraseItemView.setText("No Phrase");
        }
    }

    void setPhrases(List<Cache> phrases){
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
