package rx200.nav;

public class Colors {
	public static int background, text, button, focus;
	public static void init(){
		initColor(Setting.getColor());
	}
	private static void initColor(int color){
		background = color;
		float r = (background >> 16 & 0xFF) * .299f;
		float g = (background >> 8 & 0xFF) * .578f;
		float b = (background & 0xFF) * .114f;
		int light = (int) (r + g + b);
		byte dilimitr = 127;// 128
		if(light > dilimitr){// Светлая тема
			light -= dilimitr;
			light |= (light << 8) | (light << 16);
			text = 0xFF000000;
			button = 0x55000000 | light;
			focus = 0x33000000 | light;
		} else {// Темная тема
			light += dilimitr;
			light |= (light << 8) | (light << 16);
			text = 0xFFFFFFFF;
			button = 0x33000000 | light;
			focus = 0x55000000 | light;
		}
	}
	public static void setColor(int color){
		initColor(color);
		Setting.setColor(color);
	}
}
