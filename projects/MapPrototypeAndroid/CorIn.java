package rx200.mapprototype;

import android.graphics.Canvas;
import android.view.MotionEvent;

public class CorIn {
	public boolean is = false;
	//public int lat, lon;
	public double lat, lon;
	private Button b, b_map, b_del;

	private byte[] digits = new byte[16];
	private float digitF;
	private float H_px = G.H_px * .8f;
	public CorIn(){
		b_del = new Button(Texts.b_del_map, G.h - G.H_px * 3.4f, this::delPoint);
		b = new Button(Texts.b_enter, G.h - G.H_px * 2.2f, this::enter);
		b_map = new Button(Texts.b_on_map, G.h - G.H_px, this::addPoint);
	}
	private boolean flagAddPoint = false;
	public void addPoint(){


		G.setting.setOnPoint(true);
		flagAddPoint = true;
		enter();
		ViewMap.setTopText();
	}
	public void delPoint(){
		if(G.setting.xy2) {
			G.setting.setOnPoint(false);
			is = false;
		}else enter();
	}
	public void enter(){
		flag_move = false;
		int lat = 0;
		int lon = 0;
		int i2 = 1;
		for(int i = 0; i < 8; i++) {
			lat += digits[i] * (10000000 / i2);
			i2 *= 10;
		}
		i2 = 1;

		for(int i = 0; i < 8; i++) {
			lon += digits[i + 8] * (10000000 / i2);
			i2 *= 10;
		}
		Controller.map.setCenterWGS84((double) lat / 1000000, (double) lon / 1000000);// от этого зависит *
		if(flagAddPoint){
			flagAddPoint = false;
			G.setting.saveXY2(CRS.x, CRS.y);// * Зависит это.
		}
		is = false;
	}
	public void draw(Canvas canvas){
		canvas.drawText("lat: "+String.format ("%f", lat), 10, 100, Paints.text);
		canvas.drawText("lon: "+String.format ("%f", lon), 10, 200, Paints.text);

		for (int i = 0; i < 8; i++){
			//int i2 = digits[i] % 10;
			//canvas.drawText(String.valueOf(i2 < 0 ? 10 + i2: i2), 10 + i * H_px, 240 + H_px, Paints.text);
			if(flag_move && i == i_down)continue;
			canvas.drawText(String.valueOf(digits[i]), 10 + i * H_px, 240 + H_px, Paints.text);
		}
		canvas.drawText(",", 10 + 1.65f * H_px, 240 + H_px, Paints.text);

		for (int i = 0; i < 8; i++){
			if(flag_move && i + 8 == i_down)continue;
			canvas.drawText(String.valueOf(digits[i + 8]), 10 + i * H_px, 240 + H_px * 3, Paints.text);
		}
		canvas.drawText(",", 10 + 1.65f * H_px, 240 + H_px * 3, Paints.text);
		//*
		int pos = -2;
		for (int i = digits[i_down] - 3; i < digits[i_down] + 4; i++){
			int i2 = i % 10;
			float y = ((i_down > 7 ? 240 + H_px * 2: 240) + H_px * pos++) - ((digitF * H_px) % H_px);
			if(flag_move){
				canvas.drawText(String.valueOf(i2 < 0 ? 10 + i2: i2), 10 + (i_down > 7 ? i_down - 8: i_down) * H_px, y, i == digits[i_down] ? Paints.red: Paints.text);


			} //else if(i == digits[0])canvas.drawText(String.valueOf(i2 < 0 ? 10 + i2: i2), 10, y, Paints.text);
		}
		//*/
		b_del.draw(canvas);
		b.draw(canvas);
		b_map.draw(canvas);
	}
	private boolean flag_move = false;
	private float down_y, down_x;
	private byte i_down = 0;
	public void move(MotionEvent event){

		// test
		boolean flag_b = true;
		if (flag_move && event.getAction() == MotionEvent.ACTION_MOVE) {
			//digitF -= (event.getX() - down_x) * .025;
			digitF -= (event.getRawY() - down_y) / H_px;

			//digit = Math.round(digitF);
			digits[i_down] = (byte) (digitF % 10);

			down_y = event.getRawY();
			//down_x = event.getX();
			G.draw();
		}else if (event.getAction() == MotionEvent.ACTION_DOWN) {
			down_y = event.getRawY();
			if(down_y < G.h - G.H_px * 3.4f) {
				//down_x = event.getX();

				i_down = (byte) ((event.getRawX() - 10) / H_px);
				if (i_down < 0 || i_down > 7) return;
				if (down_y > 240 + H_px * 2) i_down += 8;

				digitF = digits[i_down];
				flag_move = true;
				G.draw();
			}
		}else if (event.getAction() == MotionEvent.ACTION_UP){
			flag_move = false;
			flag_b = false;
			byte i2 = (byte) (digits[i_down] % 10);

			digits[i_down] = i2 < 0 ? (byte) (10 + i2): i2;
			digitF = digits[i_down];
			G.draw();
		}
		// end test

		if(!flag_move && flag_b) {
			b_del.move(event);
			b.move(event);
			b_map.move(event);
		}
	}
	public void on(){
		updata();
		is = true;

	}

	private void updata(){
		CRS.WM_to_wgs_84_deg(ViewMap.centerX, ViewMap.centerY);
		this.lat = CRS.lat;
		this.lon = CRS.lon;
		int lat = (int) Math.round(CRS.lat * 1000000);
		int lon = (int) Math.round(CRS.lon * 1000000);

		int i2 = 1;
		int i3 = 0;
		for(int i = 0; i < 8; i++) {
			byte n = (byte) ((lat - i3) / (10000000 / i2));
			digits[i] = n;
			if(i < 7){
				i3 += n * (10000000 / i2);
				i2 *= 10;

			}
		}
		i2 = 1;
		i3 = 0;
		for(int i = 0; i < 8; i++) {
			byte n = (byte) ((lon - i3) / (10000000 / i2));
			digits[i + 8] = n;
			if(i < 7){
				i3 += n * (10000000 / i2);
				i2 *= 10;

			}
		}

	}
}
