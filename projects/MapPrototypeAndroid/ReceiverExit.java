package rx200.mapprototype;

import android.content.Context;
import android.content.Intent;
import android.content.BroadcastReceiver;

public class ReceiverExit extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		G.exit();
	}
}