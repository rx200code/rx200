package rx200.mapprototype;

import android.graphics.Canvas;
import android.view.MotionEvent;

public class Controller {
	static Menu menu = new Menu();
	static ViewMap map = new ViewMap();
	static CorIn cor = new CorIn();

	protected void draw(Canvas canvas) {
		canvas.drawColor(Colors.background);
		if(menu.is){
			menu.draw(canvas);
		}else if(cor.is){
			cor.draw(canvas);
		}else{
			map.draw(canvas);
		}
	}

	private long time_up = 0;
	public void move(MotionEvent event) {
		if(menu.is){
			menu.move(event);
		}else if(cor.is){
			cor.move(event);
		}else{
			if (event.getAction() == MotionEvent.ACTION_UP){
				long endTime = System.currentTimeMillis();
				if (endTime - time_up < 400) {
					menu.is = true;
					G.draw();
				}
				time_up = endTime;
			}
			map.move(event);
		}
	}

}
