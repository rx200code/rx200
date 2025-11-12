package rx200.mapprototype;

import android.content.Intent;
import android.net.Uri;

public class Setting {
	public double x = 2.9277026078630947E7;// lon 83
	public double y = 1.2675642229738057E7;// lat 55
	public double x2 = 2.9277026078630947E7;// lon 83
	public double y2 = 1.2675642229738057E7;// lat 55
	public boolean xy2 = false;
	public boolean onTrack = false;

	public Setting(){
		// Проверка данных в BD и загрузка.
		init();

	}
	private void init(){
		double[] point = G.db.getSettingXY();
		if(point != null){
			x = point[0];
			y = point[1];
		}else G.db.setSettingXY(x, y);

		String text = G.db.getSetting("onTrack");
		if(text != null)onTrack = text.equals("true");
		else G.db.setSetting("onTrack", onTrack ? "true": "false");

		point = G.db.getSettingXY2();
		if(point != null){
			x2 = point[0];
			y2 = point[1];
		}else G.db.setSettingXY(x2, y2);

		text = G.db.getSetting("xy2");
		if(text != null)xy2 = text.equals("true");
		else G.db.setSetting("xy2", xy2 ? "true": "false");

	}
	public boolean setOnTrack(boolean onTrack){
		this.onTrack = onTrack;
		G.db.setSetting("onTrack", onTrack ? "true": "false");
		return onTrack;
	}
	public boolean setOnPoint(boolean xy2){
		this.xy2 = xy2;
		G.db.setSetting("xy2", xy2 ? "true": "false");
		return xy2;
	}
	public void saveXY(){
		if(ViewMap.centerX != x || ViewMap.centerY != y){
			x = ViewMap.centerX;
			y = ViewMap.centerY;
			G.db.setSettingXY(x, y);
		}
	}
	public void saveXY2(double x, double y){
		if(x2 != x || y2 != y) {
			x2 = x;
			y2 = y;
			G.db.setSettingXY2(x2, y2);
		}
	}
	/*
	public void saveUrlKML(Uri uri){
		G.db.setSetting("uri_kml", uri.toString());
	}//*/
	public void saveUrlKML(Uri uri){
		String textUri = G.db.getSetting("uri_kml");
		if(textUri != null){
			if(textUri.equals(uri.toString()))return;
			else G.context.getContentResolver().releasePersistableUriPermission(Uri.parse(textUri), Intent.FLAG_GRANT_READ_URI_PERMISSION);
		}
		G.context.getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
		G.db.setSetting("uri_kml", uri.toString());
	}
	public Uri getUrlKML(){
		String textUri = G.db.getSetting("uri_kml");
		if(textUri != null)return Uri.parse(textUri);
		else return null;
	}
}
