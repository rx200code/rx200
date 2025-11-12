package rx200.mapprototype;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.util.Xml;
import org.xmlpull.v1.XmlPullParser;

import java.io.File;
import java.util.ArrayList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class LoadMap {
	static class ElmImg {
		public String href;
		public Bitmap img;
		public ElmImg(String href, Bitmap img){
			this.href = href;
			this.img = img;
		}
	}
	static MapImgs KMZ(Uri uri){
		int hashSum = 0;
		boolean flagKML = false;
		ArrayList<ElmKML> listKML = null;
		ArrayList<ElmImg> listImg = new ArrayList<>();
		try {
			ZipInputStream zipIs = new ZipInputStream(G.context.getContentResolver().openInputStream(uri));
			ZipEntry ze;
			while ((ze = zipIs.getNextEntry()) != null) {
				String name = ze.getName();
				if(!flagKML && name.endsWith(".kml")){
					listKML = parserKML(zipIs);
					if(listKML != null){
						flagKML = true;
						hashSum ^= ze.hashCode();
					}
				} else {
					Bitmap img = BitmapFactory.decodeStream(zipIs);
					if(img != null){
						listImg.add(new ElmImg(name, img));
						hashSum ^= ze.hashCode();
					}
				}
			}
		}catch (Exception e) {
			G.out_e("ERROR LoadMap.KMZ : "+e.getMessage());
		}
		if(flagKML){
			MapImgs mapImgs = new MapImgs(listKML.size(), hashSum);
			int i = 0;
			for (ElmKML elmKML : listKML){
				for (ElmImg elmImg : listImg){
					if(elmKML.href.equals(elmImg.href)){
						MapImg mapImg = new MapImg();
						mapImg.img = elmImg.img;
						CRS.deg_wgs_84_to_WM(elmKML.minY, elmKML.minX);
						mapImg.minY = CRS.y;
						mapImg.minX = CRS.x;
						CRS.deg_wgs_84_to_WM(elmKML.maxY, elmKML.maxX);
						mapImg.maxY = CRS.y;
						mapImg.maxX = CRS.x;
						mapImgs.imgs[i++] = mapImg;
					}
				}
			}
			return mapImgs.imgs.length == i ? mapImgs: null;
		}else return null;
	}
	static class ElmKML {
		public Double minY, maxY, maxX, minX;
		public String href;
	}
	static ArrayList<ElmKML> parserKML(ZipInputStream zipIs){
		XmlPullParser parser = Xml.newPullParser();
		try {
			parser.setInput(zipIs, null);
			ArrayList<ElmKML> list = new ArrayList<>();
			while (parser.next() != XmlPullParser.END_DOCUMENT) {
				if(parser.getEventType() == XmlPullParser.START_TAG && parser.getName().equals("GroundOverlay")){
					ElmKML elm = new ElmKML();
					while (parser.next() != XmlPullParser.END_TAG || !parser.getName().equals("GroundOverlay")){
						if(parser.getEventType() == XmlPullParser.START_TAG){
							String name = parser.getName();
							if(name.equals("href") && parser.next() == XmlPullParser.TEXT)elm.href = parser.getText();
							else if(name.equals("north") && parser.next() == XmlPullParser.TEXT)elm.minY = Double.parseDouble(parser.getText());
							else if(name.equals("south") && parser.next() == XmlPullParser.TEXT)elm.maxY = Double.parseDouble(parser.getText());
							else if(name.equals("east") && parser.next() == XmlPullParser.TEXT)elm.maxX = Double.parseDouble(parser.getText());
							else if(name.equals("west") && parser.next() == XmlPullParser.TEXT)elm.minX = Double.parseDouble(parser.getText());
						}
					}
					if(elm.href != null && elm.minY != null && elm.maxY != null && elm.maxX != null && elm.minX != null)list.add(elm);
				}
			}
			if(list.size() > 0)return list;
			else return null;
		}catch (Exception e) {
			G.out_e("ERROR LoadMap.parserKML : "+e.getMessage());
			return null;
		}
	}
}