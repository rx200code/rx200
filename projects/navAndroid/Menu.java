package rx200.nav;

import android.graphics.Canvas;
import android.view.MotionEvent;

public abstract class Menu implements DrawMove{
	protected DrawMove[] list;

	public void draw(Canvas canvas){
		for (DrawMove d: list){
			d.draw(canvas);
		}
	}
	public void move(MotionEvent event) {
		for (DrawMove d: list){
			d.move(event);
		}
	}
}
