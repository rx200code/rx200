package rx200.mapprototype;

import android.graphics.Paint;

public class Paints {
	static Paint p = new Paint();
	static Paint red = new Paint();
	static Paint rose = new Paint();
	static Paint pos = new Paint();
	static Paint blue = new Paint();
	static Paint text = new Paint();
	static Paint glass = new Paint();
	static {
		red.setColor(0xffff0000);
		red.setStyle(Paint.Style.STROKE);
		red.setStrokeWidth(2.0f * G.density);
		red.setTextSize(G.H_px * .8f);
		rose.setColor(0x88fc0fc0);
		rose.setStyle(Paint.Style.STROKE);
		rose.setStrokeWidth(3.0f * G.density);
		rose.setTextSize(G.H_px * .8f);
		pos.setColor(0xffff0000);
		pos.setTextSize(G.H_px * .8f);
		text.setTextSize(G.H_px * .8f);
		blue.setColor(0xff0000ff);
		glass.setColor(0x88ffffff);
	}
}
