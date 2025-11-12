package rx200.mapprototype;


import android.graphics.Canvas;
import android.graphics.Paint;
import android.view.MotionEvent;

public class Button implements DrawMove{



	private String text;
	private float left, top, right, bottom;
	private Runnable method = null;



	static Paint p;
	static {
		p = new Paint();
		p.setTextAlign(Paint.Align.CENTER);
		p.setTextSize(G.H_px * .8f);
		p.setStrokeWidth(G.H_px * .08f);
	}
	public Button(String text, float pos_h, Runnable method){
		this.text = text;
		this.method = method;
		left = (G.w - (Button.p.measureText(text) + G.H_px * .4f)) / 2;
		top = pos_h;
		right = G.w - left;
		bottom = pos_h + G.H_px;

	}
	public void setText(String text){
		this.text = text;
		left = (G.w - (Button.p.measureText(text) + G.H_px * .4f)) / 2;
		right = G.w - left;
	}

	@Override
	public void draw(Canvas canvas){
		p.setStyle(Paint.Style.STROKE);
		canvas.drawRect(left, top, right, bottom, Button.p);
		p.setStyle(Paint.Style.FILL);
		canvas.drawText(text, G.w / 2, G.H_px * .8f + top, p);
	}
	private boolean isMove(float x, float y){
		return x >= left && x <= right && y >= top && y <= bottom;
	}
	@Override
	public boolean move(MotionEvent event){
		if (isMove(event.getX(), event.getY())) {
			method.run();
			return true;
		}else return false;
	}
}
