package rx200.mapprototype;

import android.graphics.Canvas;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.net.Uri;
import android.view.MotionEvent;

import java.nio.ByteBuffer;
import java.util.ArrayList;

public class ViewMap {
	static double centerX, centerY, minX, maxX, minY, maxY, ratio, res, h_indent, w_indent;
	static final double width_WM = Math.PI * 2 * CRS.wgs_84_a;// 40075017 // 40075016.68557849 // ширена нулевого слайда в WМ.
	static final double sizeTile = 256;
	static double centerLat = 55;
	static double centerLon = 83;
	static double z = 17;
	static String dist_m, a_deg;
	public ArrayList<MapImgs> ListMapImags = new ArrayList<>(1);
	public Treck treck = new Treck();
	public Path pathTreck = new Path();
	public boolean flagFirst;
	public ViewMap(){
		// Определяем координаты углов.
		res = width_WM / (sizeTile * Math.pow(2, z));// Разрешение.// Расстояние WM в одном пикселе.
		ratio = 1 / res;// соотношение.
		h_indent = G.h / 2 * res;// Отступ от центра.
		w_indent = G.w / 2 * res;// Отступ от центра.

		// Определяем координаты центра.
		//setCenterWGS84(centerLat, centerLon);
		setCenterWM(G.setting.x, G.setting.y);
		Uri uri = G.setting.getUrlKML();
		if(uri != null)addMapImgs(LoadMap.KMZ(uri));
		//if(G.setting.onTrack)
		G.db.getTreck(treck);
	}
	static public void setTopText(){
		if(G.x != null){
			if(G.setting.xy2)CRS.WM_to_wgs_84_rad(G.setting.x2, G.setting.y2);
			else CRS.WM_to_wgs_84_rad(centerX, centerY);
			CRS.get_dist(G.lat * CRS.r_1, G.lon * CRS.r_1, CRS.lat, CRS.lon);

			//CRS.compass_angle(G.lat * CRS.r_1, G.lon * CRS.r_1);
			//CRS.compass_angle(CRS.lat, CRS.lon);
			if(CRS.s >= 0.5) {
				dist_m = Long.toString(Math.round(CRS.s))+" m";

				double a = (CRS.a - CRS.wmm_a) % CRS.r_360;
				if(a < 0)a += CRS.r_360;

				a_deg = Long.toString(Math.round(a / CRS.r_1))+" °";
				//a_deg = Double.toString(CRS.wmm_a / CRS.r_1)+" °";
				return;
			}
		}
		dist_m = "0";
		a_deg = "0";
	}
	public void setCenterWGS84(double lat, double lon){
		CRS.deg_wgs_84_to_WM(lat, lon);
		setCenterWM(CRS.x, CRS.y);
	}
	public void setCenterWM(double x, double y){
		centerX = x;
		centerY = y;
		minX = centerX - w_indent;
		maxX = centerX + w_indent;
		minY = centerY - h_indent;
		maxY = centerY + h_indent;
		setTopText();
	}
	public void addMapImgs(MapImgs mapImgs){
		if(mapImgs == null)return;
		//for (MapImgs m : ListMapImags) if (m.hashSum == mapImgs.hashSum)return;
		if(ListMapImags.size() > 0)ListMapImags.set(0, mapImgs);
		else ListMapImags.add(mapImgs);
	}
	public Rect srcRect = new Rect(0, 0, 1024, 1024);
	public RectF dstRectF = new RectF(0, 0, 1024, 1024);
	public void draw(Canvas canvas) {
		for (MapImgs mapImgs : ListMapImags) {
			for (MapImg mapImg : mapImgs.imgs) {
				if (mapImg.minY > maxY || mapImg.maxY < minY || mapImg.minX > maxX || mapImg.maxX < minX) continue;
				srcRect.right = mapImg.img.getWidth();
				srcRect.bottom = mapImg.img.getHeight();
				float y_min_img = (float) ((mapImg.minY - minY) * ratio);
				float y_max_img = (float) ((mapImg.maxY - minY) * ratio);
				float x_min_img = (float) ((mapImg.minX - minX) * ratio);
				float x_max_img = (float) ((mapImg.maxX - minX) * ratio);
				dstRectF.top = y_min_img;
				dstRectF.bottom = y_max_img;
				dstRectF.left = x_min_img;
				dstRectF.right = x_max_img;
				canvas.drawBitmap(mapImg.img, srcRect, dstRectF, Paints.p);
			}
		}
		flagFirst = true;
		float x, y;
		for (Treck.Node node : treck.nodes) {
			x = (float) ((node.x - minX) * ratio);
			y = (float) ((node.y - minY) * ratio);
			if(x > 5000 || x < -5000 || y > 5000 || y < -5000)continue;
			if(flagFirst){
				pathTreck.moveTo(x, y);
				flagFirst = false;
			}else pathTreck.lineTo(x, y);
		}
		canvas.drawPath(pathTreck, Paints.red);
		pathTreck.reset();

		if(G.x != null){
			float xPos = (float) ((G.x - minX) * ratio);
			float yPos = (float) ((G.y - minY) * ratio);
			if(G.setting.xy2){
				canvas.drawLine(xPos, yPos, (float) ((G.setting.x2 - minX) * ratio), (float) ((G.setting.y2 - minY) * ratio), Paints.rose);
			}
			canvas.drawCircle(xPos, yPos, G.rPos, Paints.pos);

		}





		canvas.drawCircle(G.w / 2, G.h / 2, G.rCenter, Paints.blue);

		canvas.drawRect(0, 0, G.w, G.H_px, Paints.glass);
		canvas.drawText(dist_m, 10, G.H_px * .8f, Paints.text);
		canvas.drawText(a_deg, G.w / 2, G.H_px * .8f, Paints.text);
	}

	static boolean flag_move = false;
	static float d, down_d;
	static float down_y, down_x;
	static final double LN2 = Math.log(2);
	public void move(final MotionEvent event){
		if (event.getPointerCount() == 2){
			if (event.getActionMasked() == MotionEvent.ACTION_MOVE) {
				d =  (float) Math.sqrt(Math.pow(event.getX(0) - event.getX(1), 2) + Math.pow(event.getY(0) - event.getY(1), 2));
				res *= (down_d / d);
				z = Math.log(width_WM / res / sizeTile) / LN2;
				ratio = 1 / res;// соотношение.
				h_indent = G.h / 2 * res;// Отступ от центра.
				w_indent = G.w / 2 * res;// Отступ от центра.
				minX = centerX - w_indent;
				maxX = centerX + w_indent;
				minY = centerY - h_indent;
				maxY = centerY + h_indent;
				down_d =  d;
				flag_save = true;
				flag_move = false;
				G.draw();
			} else if (event.getActionMasked() == MotionEvent.ACTION_POINTER_DOWN) {
				down_d =  (float) Math.sqrt(Math.pow(event.getX(0) - event.getX(1), 2) + Math.pow(event.getY(0) - event.getY(1), 2));
			}
			return;
		}

		if (flag_move && event.getAction() == MotionEvent.ACTION_MOVE) {
			centerX -= (event.getX() - down_x) * res;
			centerY -= (event.getY() - down_y) * res;
			minX = centerX - w_indent;
			maxX = centerX + w_indent;
			minY = centerY - h_indent;
			maxY = centerY + h_indent;
			down_y = event.getY();
			down_x = event.getX();
			flag_save = true;
			setTopText();
		}else if (event.getAction() == MotionEvent.ACTION_DOWN) {
			down_y = event.getY();
			down_x = event.getX();
			flag_move = true;
		}else if (event.getAction() == MotionEvent.ACTION_UP){
			flag_move = false;
			saveXY();
		}
		G.draw();
	}
	static boolean flag_save = false;
	public void saveXY(){
		if(flag_save){
			G.setting.saveXY();
			flag_save = false;
		}
	}

}
