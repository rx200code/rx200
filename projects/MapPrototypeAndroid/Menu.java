package rx200.mapprototype;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Canvas;
import android.os.Environment;
import android.view.MotionEvent;

import androidx.core.app.ActivityCompat;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Menu {
	public boolean is = false;
	private DrawMove[] list;
	public Menu(){
		list = new DrawMove[]{
				new Button(Texts.b_kmz, G.H_px * .2f, () -> G.activity.openFile(C.CODE_KMZ)),
				new Checkbox(G.onPosGPS, G.H_px * 1.4f, () -> {
					if((G.onPosGPS = !G.onPosGPS) && G.x != null){
						Controller.map.setCenterWM(G.x, G.y);
						G.setting.saveXY();
					}
				}),
				new Button(G.setting.onTrack ? Texts.b_stop_track: Texts.b_start_track, G.H_px * 2.7f, () -> {
					if(G.setting.setOnTrack(!G.setting.onTrack))((Button)this.list[2]).setText(Texts.b_stop_track);
					else ((Button)this.list[2]).setText(Texts.b_start_track);
				}),
				new Button(Texts.b_save_gpx, G.H_px * 3.9f, () -> {
					if(Controller.map.treck.nodes.size() < 2){
						G.out_e("ERROR Menu: save file: трека нет или в нем менее двух точек");
						return;
					}
					if(ActivityCompat.checkSelfPermission(G.context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
						G.out_e("ERROR Menu: save file: Нет разрешения на запись файла");
					}else{
						double minLat = 400;
						double minLon = 400;
						double maxLat = -400;
						double maxLon = -400;
						DateFormat dateFormat = new SimpleDateFormat("dd_MM_yyyy", Locale.getDefault());
						String name = "lisa_0_"+dateFormat.format(new Date());
						String trkGPX = "<trk><name>"+name+"</name><desc></desc><trkseg>";
						for (Treck.Node node : Controller.map.treck.nodes) {
							CRS.WM_to_wgs_84_deg(node.x, node.y);
							if(minLat < CRS.lat)minLat = CRS.lat;
							if(minLon < CRS.lon)minLon = CRS.lon;
							if(maxLat > CRS.lat)maxLat = CRS.lat;
							if(maxLon > CRS.lon)maxLon = CRS.lon;
							trkGPX += "<trkpt lat=\""+G.df(CRS.lat)+"\" lon=\""+G.df(CRS.lon)+"\"><time>"+G.getTimeGPX(node.t)+"</time></trkpt>";
						}
						String textGPX = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><gpx xmlns=\"http://www.topografix.com/GPX/1/1\" creator=\"prototip\" version=\"1.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\">"+
								"<metadata><time>"+G.getTimeGPX(System.currentTimeMillis())+"</time><bounds minlat=\""+G.df(minLat)+"\" minlon=\""+G.df(minLon)+"\" maxlat=\""+G.df(maxLat)+"\" maxlon=\""+G.df(maxLon)+"\"/></metadata>"+
								trkGPX+"</trkseg></trk></gpx>";
						try {
							File gpxfile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), name+".gpx");
							int i = 0;
							while (gpxfile.exists() && i <= 100)gpxfile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), name+"("+Integer.toString(++i)+").gpx");
							if(i > 100){
								G.out_e("ERROR Menu: save file: Больше 100 файлов с таким именем.");
								return;
							}
							FileWriter writer = new FileWriter(gpxfile);
							writer.append(textGPX);
							writer.flush();
							writer.close();
						} catch (IOException e) {
							G.out_e("ERROR Menu: save file: "+e.getMessage());
						}
					}
				}),
				new Button(Texts.b_remove_track, G.H_px * 5.2f, () -> {
					G.db.delTreck();
					Controller.map.treck.nodes.clear();
				}),
				new Button(Texts.b_add_point, G.H_px * 6.4f, () -> Controller.cor.on())
		};
	}

	public void draw(Canvas canvas){
		if(is) {
			for (DrawMove d: list){
				d.draw(canvas);
			}
		}
	}
	public void move(MotionEvent event) {
		if(is && event.getAction() == MotionEvent.ACTION_UP) for (DrawMove m: list){
			if(m.move(event)){
				is = false;
				G.draw();
			}
		}
	}
}
