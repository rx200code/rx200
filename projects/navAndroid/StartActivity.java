package rx200.nav;

import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;

import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

public class StartActivity extends Activity {
    public StartView view;
    @Override
    protected void onCreate ( Bundle savedInstanceState ) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        G.activity = this;
        setContentView(view = new StartView(this));
        // TEST
        test();
    }
    public static class StartView extends View {
        public StartView(Context context) {
            super(context);
        }
        @Override
        protected void onDraw(Canvas canvas) {
            canvas.drawColor(Colors.background);
            G.currentView.draw(canvas);
        }
        @Override
        public boolean onTouchEvent(final MotionEvent event) {
            G.currentView.move(event);
            return true;
        }
    }
    @Override
    public void onBackPressed() {
        if(G.currentView == G.map)super.onBackPressed();
        else G.setViewMap();
    }
    // TEST
    private void test(){
        //OneTimeWorkRequest WorkRequestGPS = new OneTimeWorkRequest.Builder(WorkerGPS.class).build();
        //WorkManager workManager = WorkManager.getInstance(Context);
        //WorkManager.getInstance().enqueue(WorkRequestGPS);
    }
}