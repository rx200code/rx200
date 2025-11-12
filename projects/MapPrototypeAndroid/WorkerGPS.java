package rx200.mapprototype;


import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.List;

public class WorkerGPS extends Worker {

	private LocationManager locationManager;

	public WorkerGPS(@NonNull Context context, @NonNull WorkerParameters parameters) {
		super(context, parameters);

		locationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
	}

	@NonNull
	@Override
	public Result doWork() {
		G.out("doWork");
		try {
			Looper.prepare();
			locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 7, new LocationListener() {
				@Override
				public void onLocationChanged(@NonNull Location location) {
					G.timeXY = location.getTime();
					G.out("lat: "+location.getLatitude()+" lon: "+location.getLongitude());
					CRS.deg_wgs_84_to_WM(location.getLatitude(), location.getLongitude());
					G.x = CRS.x;
					G.y = CRS.y;
					//G.out_e("lat: "+lat+" lon:"+lon);
					if (G.onPosGPS) Controller.map.setCenterWM(G.x, G.y);
					if (G.setting.onTrack) {
						Controller.map.treck.addNode(G.x, G.y, G.timeXY);
						G.db.addNodeTreck(G.x, G.y, G.timeXY);
					}
					G.draw();
					G.out("doWork 3");

					// TEST SAVE GPX


					// END TEST SAVE GPX

				}
				@Override
				public void onFlushComplete(int requestCode) {
					G.out("onFlushComplete: requestCode: "+requestCode);
				}

				@Override
				public void onLocationChanged(List<Location> locations) {
					G.out("onLocationChanged: locations.size(): "+locations.size());
				}

				@Override
				public void onProviderDisabled(String provider) {
					G.out("onProviderDisabled: provider: "+provider);
				}

				@Override
				public void onProviderEnabled(String provider) {
					G.out("onProviderEnabled: provider: "+provider);
				}

				@Override
				public void onStatusChanged(String text, int i, Bundle bundle) {
					G.out("onStatusChanged: text: "+text+" i: "+i);
				}
			}, Looper.myLooper());
			Looper.loop();
			return Result.success();
		}catch (SecurityException e){
			G.out_e("ERROR doWork: "+e.getMessage());
			return Result.failure();
		}
	}
}
