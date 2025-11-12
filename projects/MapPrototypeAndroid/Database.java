package rx200.mapprototype;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

public class Database {
	static final String name = "data";// Имя базы данных.
	static final String setting = "setting";// Имя таблицы настроек. k | v
	static final String treck = "treck";// Имя таблицы текущего трека. Обновляемый. id | x | y | t - time date
	static final String points = "points";// Имя таблицы точек. x | y | n | t
	private SQLiteDatabase db;
	private Cursor c;
	private SQLiteStatement insert_XY, insert_XY2, insert_treck;
	public Database(){
		try {
			db = G.context.openOrCreateDatabase(name, android.content.Context.MODE_PRIVATE ,null);
			db.execSQL("CREATE TABLE IF NOT EXISTS "+setting+"(k TEXT NOT NULL UNIQUE, v TEXT)");
			db.execSQL("CREATE TABLE IF NOT EXISTS "+treck+"(id INTEGER PRIMARY KEY AUTOINCREMENT, x REAL NOT NULL, y REAL NOT NULL, t INTEGER NOT NULL)");
			db.execSQL("CREATE TABLE IF NOT EXISTS "+points+"(x REAL NOT NULL, y REAL NOT NULL, n TEXT, t INTEGER)");
			insert_XY = db.compileStatement("INSERT OR REPLACE INTO "+setting+"(k, v) VALUES ('x', ?), ('y', ?);");
			insert_XY2 = db.compileStatement("INSERT OR REPLACE INTO "+setting+"(k, v) VALUES ('x2', ?), ('y2', ?);");
			insert_treck = db.compileStatement("INSERT INTO "+treck+"(x, y, t) VALUES (?, ?, ?);");
		}catch (Exception e){
			G.out_e("ERROR Database: "+e.getMessage());
		}
	}

	public void getTreck(Treck treck){
		try {
			c = db.rawQuery("SELECT x, y, t FROM "+this.treck+" ORDER BY id;", null);
			while (c.moveToNext())treck.addNode(c.getDouble(0), c.getDouble(1), c.getLong(2));
		}catch (Exception e){
			G.out_e("ERROR Database.getTreck: "+e.getMessage());
		}finally {
			if(c != null)c.close();
		}
	}

	public void addNodeTreck(double x, double y, long time){
		try {
			insert_treck.bindDouble(1, x);
			insert_treck.bindDouble(2, y);
			insert_treck.bindLong(3, time);
			insert_treck.executeInsert();
			insert_treck.clearBindings();
		}catch (Exception e){
			G.out_e("ERROR Database.addNodeTreck: "+e.getMessage());
		}
	}
	public void delTreck(){
		try {
			db.execSQL("DROP TABLE IF EXISTS "+treck);
			db.execSQL("CREATE TABLE "+treck+"(id INTEGER PRIMARY KEY AUTOINCREMENT, x REAL NOT NULL, y REAL NOT NULL, t INTEGER NOT NULL)");
		}catch (Exception e){
			G.out_e("ERROR Database.delTreck: "+e.getMessage());
		}
	}
	public void setSetting(String key, String value){
		try {
			db.execSQL("INSERT OR REPLACE INTO "+setting+"(k, v) VALUES('"+key+"', '"+value+"');");
		}catch (Exception e){
			G.out_e("ERROR Database.setSetting: "+e.getMessage());
		}
	}
	public String getSetting(String key){
		try {
			c = db.rawQuery("SELECT v FROM "+setting+" WHERE k = '"+key+"';", null);
			if(c.moveToFirst())return c.getString(0);
			else return null;
		}catch (Exception e){
			G.out_e("ERROR Database.getSetting: "+e.getMessage());
			return null;
		}finally {
			if(c != null)c.close();
		}
	}
	public void delSetting(String key){
		try {
			db.execSQL("DELETE FROM "+setting+" WHERE k = '"+key+"';");
		}catch (Exception e){
			G.out_e("ERROR Database.delSetting: "+e.getMessage());
		}
	}
	public void setSettingXY(double x, double y){
		try {
			insert_XY.bindDouble(1, x);
			insert_XY.bindDouble(2, y);
			insert_XY.executeInsert();
			insert_XY.clearBindings();
		}catch (Exception e){
			G.out_e("ERROR Database.setSettingXY: "+e.getMessage());
		}
	}
	public double[] getSettingXY(){
		try {
			c = db.rawQuery("SELECT k, v FROM "+setting+" WHERE k IN ('x', 'y');", null);
			if (c.moveToFirst()){
				if(c.getString(0).equals("x")){
					double n = c.getDouble(1);
					if(c.moveToNext())if(c.getString(0).equals("y"))return new double[]{n, c.getDouble(1)};
				}else if(c.getString(0).equals("y")){
					double n = c.getDouble(1);
					if(c.moveToNext())if(c.getString(0).equals("x"))return new double[]{c.getDouble(1), n};
				}
			}
		}catch (Exception e){
			G.out_e("ERROR Database.getSetting: "+e.getMessage());
		}finally {
			if(c != null)c.close();
		}
		return null;
	}
	public void setSettingXY2(double x, double y){
		try {
			insert_XY2.bindDouble(1, x);
			insert_XY2.bindDouble(2, y);
			insert_XY2.executeInsert();
			insert_XY2.clearBindings();
		}catch (Exception e){
			G.out_e("ERROR Database.setSettingXY: "+e.getMessage());
		}
	}
	public double[] getSettingXY2(){
		try {
			c = db.rawQuery("SELECT k, v FROM "+setting+" WHERE k IN ('x2', 'y2');", null);
			if (c.moveToFirst()){
				if(c.getString(0).equals("x2")){
					double n = c.getDouble(1);
					if(c.moveToNext())if(c.getString(0).equals("y2"))return new double[]{n, c.getDouble(1)};
				}else if(c.getString(0).equals("y2")){
					double n = c.getDouble(1);
					if(c.moveToNext())if(c.getString(0).equals("x2"))return new double[]{c.getDouble(1), n};
				}
			}
		}catch (Exception e){
			G.out_e("ERROR Database.getSetting: "+e.getMessage());
		}finally {
			if(c != null)c.close();
		}
		return null;
	}

}
