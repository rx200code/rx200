package rx200.mapprototype;

import android.graphics.Canvas;
import android.view.MotionEvent;

public interface DrawMove {
	public void draw(Canvas canvas);
	public boolean move(MotionEvent event);
}
