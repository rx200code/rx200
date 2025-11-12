package rx200.nav;

import android.graphics.Canvas;
import android.view.MotionEvent;

public interface DrawMove {
	public void draw(Canvas canvas);
	public void move(MotionEvent event);
}
