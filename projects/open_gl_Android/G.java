package rx200.open_gl;

import android.app.Application;
import android.util.Log;

public class G extends Application {

    static String TAG = "Nav_LOG";
    static void out(String text){
        Log.d ( G.TAG, text );
    }

    @Override
    public void onCreate()
    {
        super.onCreate();
    }
}
