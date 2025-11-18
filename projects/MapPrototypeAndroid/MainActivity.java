package rx200.mapprototype;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Canvas;
import android.os.Build;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;



public class MainActivity extends Activity {

    public ControllerView view;
    @Override
    protected void onCreate ( Bundle savedInstanceState )
    {
        super.onCreate ( savedInstanceState );
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        G.activity = this;
        setContentView (view = new ControllerView( this ));
        if(!G.flagGPS){
            checPermissions();

            G.flagGPS = true;
        }

    }




    class ControllerView extends View {
        public ControllerView(Context context) {
            super(context);
        }
        @Override
        protected void onDraw(Canvas canvas) {
            G.controller.draw(canvas);
        }
        @Override
        public boolean onTouchEvent(final MotionEvent event) {
            G.controller.move(event);
            return true;
        }

    }
    public void openFile(int requestCode){
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        startActivityForResult(intent, requestCode);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent resultData) {
        if (resultData != null && resultCode == Activity.RESULT_OK){
            switch (requestCode) {
                case C.CODE_KMZ:

                    MapImgs mapImgs = LoadMap.KMZ(resultData.getData());
                    if(mapImgs != null) {
                        Controller.map.addMapImgs(mapImgs);
                        G.setting.saveUrlKML(resultData.getData());
                        G.draw();
                    }
                    break;
                default:
                    G.out_e("ERROR: неверный requestCode");
                    break;
            }
        }else G.out_e("ERROR: onActivityResult");
    }






    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == 200 && grantResults[0] == RESULT_OK){
            checPermissions();
        }else{

        }
    }

    //public LocationManager locationManager;



    public void checPermissions(){
    	if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && (
                ActivityCompat.checkSelfPermission(G.context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                ActivityCompat.checkSelfPermission(G.context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                ActivityCompat.checkSelfPermission(G.context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)
        )
        {
            G.activity.requestPermissions(new String[]{
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
            }, 200);
        }else if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && (
                ActivityCompat.checkSelfPermission(G.context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                        ActivityCompat.checkSelfPermission(G.context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                        ActivityCompat.checkSelfPermission(G.context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED ||
						ActivityCompat.checkSelfPermission(G.context, Manifest.permission.FOREGROUND_SERVICE) != PackageManager.PERMISSION_GRANTED ||
                        ActivityCompat.checkSelfPermission(G.context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)
        )
        {
            G.activity.requestPermissions(new String[]{
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION,
					Manifest.permission.FOREGROUND_SERVICE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
            }, 200);
        }else{
            //G.out("OneTimeWorkRequest");


            //requestLocationUpdates();


            //OneTimeWorkRequest myWorkRequest = new OneTimeWorkRequest.Builder(WorkerGPS.class).build();
            //WorkManager.getInstance(G.context).enqueue(myWorkRequest);
            //G.initGPS();
            /*
            G.locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 7, new LocationListener() {
                @Override
                public void onLocationChanged(@NonNull Location location) {
                    G.out(location.getLatitude()+" "+location.getLongitude());
                    G.timeXY = location.getTime();
                    CRS.deg_wgs_84_to_WM(location.getLatitude(), location.getLongitude());
                    G.x = CRS.x;
                    G.y = CRS.y;
                    //G.out_e("lat: "+lat+" lon:"+lon);
                    if(G.onPosGPS)Controller.map.setCenterWM(G.x, G.y);
                    if(G.setting.onTrack){
                        Controller.map.treck.addNode(G.x, G.y, G.timeXY);
                        G.db.addNodeTreck(G.x, G.y, G.timeXY);
                    }
                    G.draw();
                    // TEST SAVE GPX


                    // END TEST SAVE GPX

                }
                @Override
                public void onStatusChanged(String text, int i, Bundle bundle){
                    //out("onStatusChanged: text: "+text);
                    //out("onStatusChanged: i: "+i);
                }
            });
            //*/
            //G.out("TEST: startService");
            //*
            Intent intent = new Intent(this, ProviderGPS.class);
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                startForegroundService(intent);
    	    else startService(intent);

            //*/// END TEST Notification

        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        //G.out("onPause");
    }
    //*
    @Override
    protected void onDestroy() {
        //G.out("onDestroy");
        super.onDestroy();
    }
    //*/
}