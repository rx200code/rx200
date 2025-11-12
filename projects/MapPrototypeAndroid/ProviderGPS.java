package rx200.mapprototype;


import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import java.util.Timer;
import java.util.TimerTask;


public class ProviderGPS extends Service {
	//public LocationManager locationManager;

	@Override
	public void onCreate() {
		//G.out("ProviderGPS:onCreate");
		//locationManager = (LocationManager)G.activity.getSystemService(Context.LOCATION_SERVICE);
	}

	//private static final String CHANNEL_ID = "GPS_channel";
	//private static final int NOTIFY_ID = 101;
	//private NotificationCompat.Builder builder;
	//private NotificationManager notificationManager;
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		//G.out("ProviderGPS:onStartCommand");
		startForeground(G.NOTIFY_ID, G.builder.build());
		G.service = this;
		if ((flags & START_FLAG_RETRY) == 0) {
			//G.out("повторный запуск");
		}
		else {
			//G.out("первый запуск");
		}
		G.initGPS();
		timerService = new Timer();
		timerService.schedule(new TimerTask() {
			@Override
			public void run() {
				G.updateService();
			}
		}, G.timerServiceInterval);
		return Service.START_STICKY;// Стоит так же рассмотреть START_NOT_STICKY и START_REDELIVER_INTENT
	}

	@Override
	public void onDestroy() {
		//G.out("ProviderGPS:onDestroy");
	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	private Timer timerService = null;
	public void stopService(){
		//G.out("ProviderGPS:stopService");
		if (timerService != null){
			timerService.cancel();
			timerService = null;
		}
		stopForeground(true);
		stopSelf();
	}
}
