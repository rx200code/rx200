#include <cmath>
#include <string>
#include <SFML/Graphics.hpp>
 
using namespace sf; // подключаем пространство имен sf
 
int main()
{	
	
	int size_w = 800;
	int size_h = 400;
	unsigned int c_background = 0x88888800;
	unsigned int c_text = 0x000000FF;
	
	double d_range = 30;
	//float f_dop = 190.f;
	
	// Объект, который, собственно, является главным окном приложения
	RenderWindow window(VideoMode(size_w, size_h), L"SFML Works! окно", Style::Default);
	
	
	// Создаем фигуру - круг радиусом 50
	CircleShape circle(50.f);
	
	// Закрашиваем наш круг 
	circle.setFillColor(Color(230, 0, 230));
	
	circle.setPosition(-50, 0);
	
	// Заготовка фигуры многоугольника 
	//ConvexShape convex;
	
	// Устанавливаем ему 5 вершин
	//convex.setPointCount(size_w * 2);
	//convex.setPointCount(size_w + 2);
	
	VertexArray myLinesStrip(LineStrip, size_w);
 	
	for(int i = 0; i < size_w; ++i){
		// Устанавливаем координаты вершин
		//float line_sin_y = (float)sin(3.14159265 * i / 180) * (size_h / 4) + (size_h / 2);
		float line_sin_y = (float)(sin(d_range / (double)size_w * (double)i) * ((double)size_h / 4) + ((double)size_h / 2));
		myLinesStrip[i].position = Vector2f(i, line_sin_y);
		//convex.setPoint(i, Vector2f((float) i, line_sin_y));
		//convex.setPoint((size_w * 2 - 1) - i, Vector2f((float) i, line_sin_y + 5.f));
		//convex.setPoint((size_w * 2 - 1) - i, Vector2f((float) i, 200.f));
	}
	
	//convex.setPoint(500, Vector2f(490.f, f_dop));
	//convex.setPoint(501, Vector2f(10.f, f_dop));
 	
	// Устанавливаем цвет многоугольника - черный
	//convex.setFillColor(Color::Black);
	
	// Теперь сдвинем его вниз и чуть-чуть вправо
	//convex.move(1, 150);
	
	// Отрисовка многоугольника
	//window.draw(convex);
	
	
	
	Clock clock;
	/*
	float time;
	clock.restart();
	time = clock.getElapsedTime().asSeconds();
	
	//clock.restart();
	//Time time1 = clock.getElapsedTime();
	Time time1;
	time1 = clock.restart();
	//time1.asSeconds()
	std::string str_time_s = std::to_string(time);
	//*/
	Font font;
	if (!font.loadFromFile("fonts/arial.ttf"))
	{
		return 7;
	}
	Text text;
	text.setFont(font);
	//text.setString(str_time_s);
	text.setCharacterSize(40);
	text.setFillColor(Color(c_text));
	text.setPosition(100, 0);
	
	Text text_event;
	text_event.setFont(font);
	//text.setString(str_time_s);
	text_event.setCharacterSize(40);
	text_event.setFillColor(Color(c_text));
	text_event.setPosition(200, 0);
	
	int counter = 0;
	
	
	
	// Главный цикл приложения: выполняется, пока открыто окно
	while (window.isOpen())
	{
		// Обрабатываем очередь событий в цикле
		Event event;
		while (window.pollEvent(event))
		{
			// Пользователь нажал на «крестик» и хочет закрыть окно?
			if (event.type == Event::Closed)
				window.close(); // тогда закрываем его
			
			++counter;
		}
		// Установка цвета фона
		window.clear(Color(c_background));
 
		// Отрисовка круга
		window.draw(circle);
		
		
		window.draw(myLinesStrip);
		
		
		
		text.setString(std::to_string((int)clock.getElapsedTime().asSeconds()));
		
		window.draw(text);
		
		
		text_event.setString(std::to_string(counter));
		window.draw(text_event);
		
		// Отрисовка окна
		window.display();
	}
 
	return 0;
}