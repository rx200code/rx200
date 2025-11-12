package rx200.mapprototype;

import android.location.Location;
import android.location.LocationListener;
import androidx.annotation.NonNull;

public class ListenerGPS implements LocationListener {
	@Override
	public void onLocationChanged(@NonNull Location location) {
		G.timeXY = location.getTime();
		G.lat = location.getLatitude();
		G.lon = location.getLongitude();
		//G.out("ListenerGPS: lat: "+G.lat+" lon: "+G.lon);
		CRS.compass_angle(G.lat * CRS.r_1, G.lon * CRS.r_1);
		CRS.deg_wgs_84_to_WM(G.lat, G.lon);
		G.x = CRS.x;
		G.y = CRS.y;
		if (G.onPosGPS){
			Controller.map.setCenterWM(G.x, G.y);
			G.builder.setContentText("lat: "+G.df(G.lat)+", lon: "+G.df(G.lon));
		} else {
			ViewMap.setTopText();
			G.builder.setContentText("s: "+ViewMap.dist_m+", a: "+ViewMap.a_deg);
		}
		if (G.setting.onTrack) {
			Controller.map.treck.addNode(G.x, G.y, G.timeXY);
			G.db.addNodeTreck(G.x, G.y, G.timeXY);
		}
		G.draw();
		G.notificationManager.notify(G.NOTIFY_ID, G.builder.build());
	}
}
