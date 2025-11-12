package rx200.mapprototype;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.view.MotionEvent;

public class Checkbox implements DrawMove{
	private float left, top, right, bottom;
	private Runnable method = null;
	private boolean flag;

	public Checkbox(boolean flag, float pos_h, Runnable method){
		this.method = method;
		this.flag = flag;
		left = G.w / 2 - G.H_px / 2;
		top = pos_h;
		right = left + G.H_px;
		bottom = pos_h + G.H_px;

	}
	@Override
	public void draw(Canvas canvas){
		if(flag)Button.p.setStyle(Paint.Style.FILL);
		else Button.p.setStyle(Paint.Style.STROKE);
		canvas.drawRect(left, top, right, bottom, Button.p);

	}
	private boolean isMove(float x, float y){
		return x >= left && x <= right && y >= top && y <= bottom;
	}
	@Override
	public boolean move(MotionEvent event){
		if (isMove(event.getX(), event.getY())) {
			flag = !flag;
			method.run();
			return true;
		}else return false;
	}

}
