package rx200.nav;


import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;


public class WorkerGPS extends Worker {
	public WorkerGPS(@NonNull Context context, @NonNull WorkerParameters parameters) {
		super(context, parameters);

	}

	@NonNull
	@Override
	public Result doWork() {
		G.out("doWork start");
		/*
		int minutes = 100;
		while ((minutes--) != 0){
			G.out("minutes = "+(100 - minutes));
			try {
				TimeUnit.SECONDS.sleep(60);
			} catch (InterruptedException e) {
				e.printStackTrace();
				G.out_e("error: "+e.getMessage());
			}
		}
		*/
		G.out("doWork end");
		return Result.success();
	}
}
