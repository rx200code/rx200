package rx200.nav;


public class Setting {
	static public void setColor(int color){
		Database.setSetting("color", Integer.toUnsignedString(color, 16));
	}
	static public int getColor(){
		String text = Database.getSetting("color");
		return text == null ? 0x00000000: Integer.parseUnsignedInt(text, 16);
	}
}
