package rx200.nav;

import android.graphics.Canvas;
import android.graphics.Paint;

public class TestInfo {
	private String text = "test";
	private Paint p;
	public TestInfo(){
		p = new Paint();
		p.setColor(0xffffffff);
		p.setStyle(Paint.Style.STROKE);
		p.setStrokeWidth(2.0f * G.density);
		p.setTextSize(G.density * 50.0f);
	}

	public void draw(Canvas canvas){
		canvas.drawText(text, 0.0f, (float) G.h, p);
	}
}
