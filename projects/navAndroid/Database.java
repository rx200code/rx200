package rx200.nav;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

public class Database {
	static final String name = "data";// Имя базы данных.
	static final String setting = "setting";// Имя таблицы настроек. k | v
	static private SQLiteDatabase db;

	static void init(Context context){
		try {
			db = context.openOrCreateDatabase(name, android.content.Context.MODE_PRIVATE ,null);
			db.execSQL("CREATE TABLE IF NOT EXISTS "+setting+"(k TEXT NOT NULL UNIQUE, v TEXT)");
		}catch (Exception e){
			G.out_e("ERROR Database: "+e.getMessage());
		}
	}
	static void setSetting(String key, String value){
		try {
			db.execSQL("INSERT OR REPLACE INTO "+setting+"(k, v) VALUES('"+key+"', '"+value+"');");
		}catch (Exception e){
			G.out_e("ERROR Database.setSetting: "+e.getMessage());
		}
	}
	static String getSetting(String key){
		Cursor c = null;
		String value = null;
		try {
			c = db.rawQuery("SELECT v FROM "+setting+" WHERE k = '"+key+"';", null);
			if(c.moveToFirst())value = c.getString(0);
		}catch (Exception e){
			G.out_e("ERROR Database.getSetting: "+e.getMessage());
		}finally {
			if(c != null)c.close();
		}
		return value;
	}
}
