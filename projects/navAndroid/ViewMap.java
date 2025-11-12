package rx200.nav;

import android.graphics.Canvas;
import android.view.MotionEvent;

public class ViewMap implements DrawMove{
	static Menu menu = new MenuMain();
	public ViewMap(){

	}
	public void draw(Canvas canvas) {
		canvas.drawText("map", 0.0f, (float) G.h, Paints.p);
	}
	static long time_up = 0;
	public void move(final MotionEvent event){
		if (event.getAction() == MotionEvent.ACTION_UP){
			long endTime = System.currentTimeMillis();
			if (endTime - time_up < 400) {
				G.setCurrent(menu);
			}
			time_up = endTime;
		}
	}
}
