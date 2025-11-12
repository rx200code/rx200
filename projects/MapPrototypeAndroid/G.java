package rx200.mapprototype;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;

public class G extends Application {
    // Для тестов
    static final String TAG = "Nav_LOG";
    static void out(String text){
        Log.d ( G.TAG, text );
    }
    static void out_e(String text){
        Log.e ( G.TAG, text );
    }
    //// Глобальные переменные, методы
    static Controller controller;
    static Database db;
    static Setting setting;
    static Context context;
    static MainActivity activity;
    static int h, w;
    static float density, rPos, rCenter;
    static boolean onPosGPS = false;
    static Double x, y;
    static double lat, lon;
    static long timeXY;
    // Button
    static final float H = 40;
    static float H_px;// Теоретически может быть не создана
    // Foreground
    public static ProviderGPS service = null;
    public static final String CHANNEL_ID = "GPS_channel";
    public static final int NOTIFY_ID = 101;
    public static NotificationCompat.Builder builder;
    public static NotificationManager notificationManager;
    static void initForeground(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // создаём канал.
            CharSequence name = "GPS_channel_name";
            String description = "GPS_channel_description";
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription(description);
            //notificationManager = getSystemService(NotificationManager.class);
            notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
            // DIALOG


            Intent intent = new Intent(context, ReceiverExit.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, /* PendingIntent.FLAG_ONE_SHOT |/**/ PendingIntent.FLAG_IMMUTABLE);
            //Intent intent = new Intent(context, x.class);
            //intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            //PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);




            //builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle("Coordinates")
                    .setContentText("lat: --.------, lon: --.------")
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);


            notificationManager.notify(NOTIFY_ID, builder.build());
        }
    }

    // GPS
    static boolean flagGPS = false;
    static LocationManager locationManager;
    static ListenerGPS listenerGPS;
    static void initGPS(){
        //G.out("initGPS");
        try {
            //locationManager.removeUpdates(LocationListener listener);
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 7000, 7, listenerGPS);
        }catch (SecurityException e){
            G.out_e("ERROR initGPS: "+e.getMessage());
        }
    }

    static void outGPSs(List<Location> locations){
        for (Location location : locations) {
            outGPS(location);
        }
    }
    static void outGPS(Location location){
        //G.out("XXX lat: "+location.getLatitude()+" XXX lon: "+location.getLongitude());
    }

    // методы
    private void init(){
        context = getApplicationContext();
        int result;
        int resourceId = G.context.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = G.context.getResources().getDimensionPixelSize(resourceId);
        }else result = (int) Math.ceil((Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? 24 : 25) * G.context.getResources().getDisplayMetrics().density);
        h = G.context.getResources().getDisplayMetrics().heightPixels - result;
        w = G.context.getResources().getDisplayMetrics().widthPixels;
        density = G.context.getResources().getDisplayMetrics().density;
        rPos = 5.0f * density;
        rCenter = 3.0f * density;
        H_px = H * G.density;
    }

    @Override
    public void onCreate()
    {
        super.onCreate();
        init();
        initForeground();
        // TEST GPS

        locationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
        listenerGPS = new ListenerGPS();
        //OneTimeWorkRequest myWorkRequest = new OneTimeWorkRequest.Builder(WorkerGPS.class).build();
        //WorkManager.getInstance(G.context).enqueue(myWorkRequest);
        // END TEST GPS
        db = new Database();
        setting = new Setting();// после создания db.
        controller = new Controller();

        //out(((CRS.wgs_84_a - CRS.wgs_84_a * CRS.f) / CRS.wgs_84_a)+" = "+Math.sqrt(1 - CRS.e_2));
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig){
        super.onConfigurationChanged(newConfig);
        init();
    }
    @Override
    public void onTrimMemory(int level){
        super.onTrimMemory(level);
        G.out("level"+level);
    }
    static void draw(){
        activity.view.invalidate();
    };

    static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault());
    static Date date = new Date();
    static String getTimeGPX(long time){
        date.setTime(time);
        return dateFormat.format(date); //return "2022-04-07T19:36:31Z";
    }
    static DecimalFormat df0 =  new DecimalFormat("#.######");
    static String df(double d){
        return df0.format(d).replace(',', '.');
    }

    static long timerServiceInterval = 8 * 60 * 1000;// 7 minutes.
    static void updateService(){
        if(G.service != null && G.activity != null)G.service.stopService();
        Intent intent = new Intent(activity, ProviderGPS.class);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            activity.startForegroundService(intent);
        else activity.startService(intent);
    }

    static void exit(){
        if(G.service != null)G.service.stopService();
        if(G.activity != null){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
            {
                G.activity.finishAffinity();
            } else
            {
                G.activity.finish();
            }
        }
        android.os.Process.killProcess(android.os.Process.myPid());
    }
}
