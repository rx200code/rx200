package rx200.nav;


import android.graphics.Canvas;
import android.graphics.Paint;
import android.view.MotionEvent;

public abstract class Button implements DrawMove{

	protected float left, top, right, bottom;
	private Runnable method;
	private boolean isFocus = false;
	static Paint p;
	static {
		p = new Paint();
		p.setTextSize(50.0f);
		p.setTextAlign(Paint.Align.CENTER);
	}

	public Button(float left, float top, float right, float bottom, Runnable method){

		this.method = method;
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}

	public void draw(Canvas canvas){
		p.setColor(isFocus ? Colors.focus: Colors.button);
		canvas.drawRect(left, top, right, bottom, p);
	}
	private boolean isMove(float x, float y){
		return x >= left && x <= right && y >= top && y <= bottom;
	}
	public void move(MotionEvent event){
		if(isMove(event.getX(), event.getY())){
			if(event.getAction() == MotionEvent.ACTION_DOWN){
				isFocus = true;
				G.draw();
			} else if(isFocus && event.getAction() == MotionEvent.ACTION_UP){
				isFocus = false;
				method.run();
			}
		}else if(isFocus){
			isFocus = false;
			G.draw();
		}
	}
}
