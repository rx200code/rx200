package rx200.nav;

import android.graphics.Canvas;

public class ButtonText extends Button{
	private String[] text;
	public ButtonText(String[] text, float left, float top, float right, float bottom, Runnable method){
		super(left, top, right, bottom, method);
		this.text = text;
	}
	public void draw(Canvas canvas){
		super.draw(canvas);
		p.setColor(Colors.text);
		canvas.drawText(text[Texts.id], (left + right) / 2, bottom, p);
	}

}
