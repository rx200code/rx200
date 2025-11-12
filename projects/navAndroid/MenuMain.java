package rx200.nav;

public class MenuMain extends Menu{

	public MenuMain(){
		list = new DrawMove[]{
				new ButtonText(Texts.language, 100.0f, 100.0f, 400.0f, 200.0f, G::setViewMap),

				new ButtonText(Texts.language, 100.0f, 300.0f, 400.0f, 400.0f, () -> {
					G.setCurrent(new MenuLanguage());
				})
		};
	}
}
