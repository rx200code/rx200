function Up_window(){//Создает объект всплывающего окна.
	this.x = 200;//Позиция левого верхнего угла окна, потом будет переписана в функцию создания окна.
	this.y = 200;//Позиция левого верхнего угла окна, потом будет переписана в функцию создания окна.
	this.size_t = 20;//Размер текста.
	this.string_length = 50;//Длина одной строки текста в количестве символов.//на 1000 пикселей примерно 108 символов.
	this.margin_left = 10;//Отступ начала текста от левого края всплывающего окна.
	this.win_width = 500;//Ширена всплывающего кона.//на 1000 пикселей примерно 108 символов.
	this.a_tspan = [];//Массив строк текста <tspan>.
	
	this.up_win = document.createElementNS(svgns, "rect");//Прямоугольник как основа всплывающего окна.
	this.up_win.setAttributeNS(null, "fill", gt_ci);//Цвет всплывающего окна.
	this.up_win.setAttributeNS(null, "stroke", gt_ci_s);//Цвет рамки всплывающего окна.
	this.up_win.setAttributeNS(null, "stroke-width", 1);//толщена рамки всплывающего окна.
	
	this.text = document.createElementNS(svgns, "text");//Создаем <text> для груперовке строк текста <tspan>.
	this.text.setAttributeNS(null,'font-size', this.size_t);//Размер текста.
	this.text.setAttributeNS(null,'fill', '#fd0');//Цвет текста.
	this.text.setAttributeNS(null, "pointer-events", "none");//Сам текст, не реагирует на события мыши, пропуская их дальше.
	
	this.graf = document.createElementNS(svgns, "g");//контейнер для графических объектов окна.
	this.graf.appendChild(this.up_win);//Добовляем "фон" всплывающего окна, в виде прямоугольника, в группу изображения.
	this.graf.appendChild(this.text);//Добовляем контейнер <text> для текста, всплывающего окна, в виде прямоугольника, в группу изображения.
	this.graf.obj = this;//Делаем ссылку на сам объект для доступа из событий на графических объектах.
	this.graf.onclick = function(){//Пока по клику на окно оно закрывается, потом будут кнопки.
		this.obj.off();//Закрываем окно.
	}
	this.on = function(text,tupe,func){//Функция выводит на экран всплывающее окно, принимает параметры, самого текста, типа окна, и в зависимости от типа функцию для диолога с пользователем. Последнее пока не реалезованою
		tupe = tupe || 0;//Тип по умолчанию, соответствует всплывающему окну без кнопок. Типы окн пока не реализованы.
		var a_strings = this.strings_t(text);//Разбиваем текст на строки и возвращаем массив строк.
		var win_height = (a_strings.length + 1) * this.size_t;//изходя из количества строк определяем высоту всплывающего окна.
		
		this.up_win.setAttributeNS(null, "width", this.win_width);//устанавливаем ширину всплывающего окна.
		this.up_win.setAttributeNS(null, "height", win_height);//Устанавливаем высоту всплывающего окна.
		
		for(i = 0; i < a_strings.length; i++){//Преаброзуем строки текста в объекты <tspan>.
			if(this.a_tspan.length < (i + 1)){//Если нехватает ранее созданных объектов <tspan> создаем.
				this.a_tspan[i] = document.createElementNS(svgns, "tspan");//Создаем строку текста.
				this.a_tspan[i].setAttributeNS(null, "x", this.margin_left);//Устанавливаем отступ строки текста от левого края всплывающего окна.
				this.a_tspan[i].setAttributeNS(null, "dy", "1em");//Устанавливаем смещение по вертикали, каждой строки на высоту строки.
			}
			this.text.appendChild(this.a_tspan[i]);//Добавляем строку текста в отображаемый контенер для текста.
			this.a_tspan[i].textContent = a_strings[i];//Заполняем видимую строку текста, самим текстом.
		}
		this.graf.setAttribute("transform", "translate("+this.x+", "+this.y+")");//Задаем смещение верхнего левого угла всплывающего окна относительно, верхнего левого угла окна самой игры.
		svg_window.appendChild(this.graf);//Отоброжаем всплывающее окно на специальном для этого уровне SVG.
	}
	this.off = function(){//Метод закрытия всплывающего окна.
		if(svg_window.contains(this.graf))svg_window.removeChild(this.graf);//Если всплывающее окно отображается удаляем его с видемого уровня для всплывающего окна.
		for(var i = 0; this.text.contains(this.a_tspan[i]); i++){//Если контент для текста заполнен строками то очещаем его от строк, это нужно для вывода последующих текстов, а сами графические объекты строк будем использовать повторно.
			this.text.removeChild(this.a_tspan[i]);
		}
	}
	this.strings_t = function(text){//Метод разбития текста на массив строк. Принимает текст, возвращает массив строк.
		var arr_lines = [];
		for (var i = 0; i <Math.ceil(text.length/this.string_length); i++){
			arr_lines[i] = text.slice((i*this.string_length), (i*this.string_length) + this.string_length);
		}
		return arr_lines;
	}
}