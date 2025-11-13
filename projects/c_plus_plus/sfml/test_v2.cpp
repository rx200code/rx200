// main.cpp
#include <SFML/Graphics.hpp>

int main()
{
	// Создаем окно размером 600 на 600 и частотой обновления 60 кадров в секунду
	sf::RenderWindow window(sf::VideoMode(600, 600), "15");
	window.setFramerateLimit(60);

	sf::Event event;

	while (window.isOpen())
	{
		while (window.pollEvent(event))
		{
			if (event.type == sf::Event::Closed) window.close();
			if (event.type == sf::Event::KeyPressed)
			{
				// Получаем нажатую клавишу - выполняем соответствующее действие
				if (event.key.code == sf::Keyboard::Escape) window.close();
			}
		}

		// Выполняем необходимые действия по отрисовке
		window.clear();
		window.display();
	}

	return 0;
}