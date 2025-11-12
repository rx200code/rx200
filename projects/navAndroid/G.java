package rx200.nav;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.util.Log;


public class G extends Application {
    // Для тестов
    static final String TAG = "Nav_LOG";
    static void out(String text){
        Log.d ( G.TAG, text );
    }
    static void out_e(String text){
        Log.e ( G.TAG, text );
    }
    //
    static int w, h;// Ширена, высота экрана
    static float density;// Логическая плотность экрана.
    static StartActivity activity;
    //
    static ViewMap map = new ViewMap();
    static DrawMove currentView = map;
    static void setViewMap(){setCurrent(map);}
    static void setCurrent(DrawMove window){
        currentView = window;
        draw();
    }
    //
    private void initDisplay(){
        Resources resources = getApplicationContext().getResources();
        int result;
        int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = resources.getDimensionPixelSize(resourceId);
        }else result = (int) Math.ceil((Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? 24 : 25) * resources.getDisplayMetrics().density);
        h = resources.getDisplayMetrics().heightPixels - result;
        w = resources.getDisplayMetrics().widthPixels;
        density = resources.getDisplayMetrics().density;
    }
    private void initClass(){// Инициализирует основные статические классы.
        Database.init(getApplicationContext());
        //Setting.init();// Инициализировать после Database
        Colors.init();// Инициализировать после Database
    }
    @Override
    public void onCreate()
    {
        super.onCreate();
        initDisplay();
        initClass();

    }
    @Override
    public void onConfigurationChanged(Configuration newConfig){
        super.onConfigurationChanged(newConfig);
        //initDisplay();
    }
    @Override
    public void onTrimMemory(int level){
        super.onTrimMemory(level);
        G.out("level "+level);
    }
    static void draw(){
        activity.view.invalidate();
    };



    static void exit(){

    }
}
