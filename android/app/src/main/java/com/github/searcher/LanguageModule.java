package com.github.searcher;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Locale;

public class LanguageModule extends ReactContextBaseJavaModule {
   public LanguageModule(ReactApplicationContext reactContext) {
       super(reactContext);
   }
   
   @Override
   public String getName() {
       return "Language";
   }
   
   @ReactMethod
   public void getDeviceLanguage(Callback cb) {
       String language = Locale.getDefault().getLanguage();
       try{
           cb.invoke(null, language);
       }catch (Exception e){
           cb.invoke(e.toString(), null);
       }
   }
}