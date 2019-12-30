package com.example.samdroid;

import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// for now this class holds conversation non-persistently.
// Later this class will provide persistence
public class Conversation {
   private ArrayList<String> phrases;
   private ArrayList<String> stage;
   public static final String LOG_TAG = Conversation.class.getSimpleName();
   private HashMap<String, Integer> keywords;

   Conversation(){
      this.phrases = new ArrayList<String>();
      this.stage = new ArrayList<String>();
      keywords = new HashMap<String, Integer>();
      keywords.put("DaVinci", 0);
      keywords.put("Galileo", 1);
      keywords.put("Machiavelli", 2);
      keywords.put("Noam Chomsky", 3);
      keywords.put("Inigo Montoya", 4);
      keywords.put("Salvador Dali", 5);
      keywords.put("Harry Potter", 6);
      keywords.put("Nicholas Flamel", 7);
      stage.add("nothing here yet");
   }

   public List<String> getPhrases() {
      if (this.phrases != null && !this.phrases.isEmpty()){
         int size = this.phrases.size();
         return this.phrases.subList(0, size);
      }
      return this.phrases;
   }

   public void addPhrase(String phrase) {
      for (String key: keywords.keySet()){
         if(phrase.toLowerCase().contains(key.toLowerCase())){
            int index = keywords.get(key);
            if(index < phrases.size()){
               stage.add(0, phrases.get(index));
               this.phrases.remove(index);
               return;
            }
         }
      }
      this.phrases.add(0, phrase);
   }

   public List<String> getStage(){
      if(this.stage !=null && !this.stage.isEmpty()){
         int size = this.stage.size();
         return this.stage.subList(0,size);
      }
      return this.stage;
   }
}
