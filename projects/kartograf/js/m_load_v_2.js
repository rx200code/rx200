function M_load(){
	let menu = document.getElementById("content_load");// Меню загрузок.
	let map_list = document.getElementById("map_list");// Меню загруженных карт.
	// Функция которая проверяет extent, находится ли один в другом.
	//return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
	let test_rects = (a, b) => a[2] > b[0] && a[0] < b[2] && a[1] < b[3] && a[3] > b[1];
	let create_map = (a_files, name) => {
		// 1. Ищим kml.
		let r_kml = /\.kml$/i;
		let index = a_files.findIndex(elm => r_kml.test(elm.name));
		if(index === -1)return;
		// 2. преобразуем kml в текст.
		let decoder = new TextDecoder();// Для работы с текстом.
		let text_kml = decoder.decode(a_files[index].buffer);// Возможно надо будет улучшить, указав прямо кодировку.
		// Парсим.
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(text_kml,"text/xml");
		// Выбираем список наложений.
		//let GroundOverlays = xmlDoc.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "GroundOverlay");
		let gov = xmlDoc.querySelectorAll("GroundOverlay");// GroundOverlays
		// Преобразуем в обекты URL с координатами рамки в проекции WM.
		let obj = {arr:[], ex:[Infinity, Infinity, -Infinity, -Infinity]};// region: extent: [minx, miny, maxx, maxy] // arr:[{url:url, ex:extent}]
		let href, west, south, east, north;
		//		  [minx, miny, maxx, maxy]
		// Регулярные выражения для определения миме типа.
		let r_jpg = /\.jpe?g$/i;
		let r_png = /\.png$/i;
		let r_gif = /\.gif$/i;
		let r_svg = /\.svg$/i;
		let r_bmp = /\.bmp$/i;
		let count = 0;
		let source;
		for(let i = 0; i < gov.length; i++){
			if((href = gov[i].querySelector("href")) && (north = gov[i].querySelector("north")) && (south = gov[i].querySelector("south")) && (east = gov[i].querySelector("east")) && (west = gov[i].querySelector("west"))){
				index = a_files.findIndex(elm => elm.name === href.textContent);
				if(index === -1)continue;
				// Определяем миме тип.
				let mt;// mimeType
				if(r_jpg.test(a_files[index].name))mt = "image/jpeg";
				else if(r_png.test(a_files[index].name))mt = "image/png";
				else if(r_gif.test(a_files[index].name))mt = "image/gif";
				else if(r_svg.test(a_files[index].name))mt = "image/svg+xml";
				else if(r_bmp.test(a_files[index].name))mt = "image/bmp";
				else continue;
				count++;
				// Координаты рамки(extent) в WM
				let c = from_wgs_84([toRad(west.textContent), toRad(south.textContent)]);// min
				if(c[0] < obj.ex[0])obj.ex[0] = c[0];
				if(c[1] < obj.ex[1])obj.ex[1] = c[1];
				let obj_i = {ex:[c[0], c[1]]};
				c = from_wgs_84([toRad(east.textContent), toRad(north.textContent)]);// max
				if(c[0] > obj.ex[2])obj.ex[2] = c[0];
				if(c[1] > obj.ex[3])obj.ex[3] = c[1];
				obj_i.ex[2] = c[0];
				obj_i.ex[3] = c[1];
				// URL картинка.
				obj_i.img = new Image();
				obj_i.img.src = URL.createObjectURL(new Blob([a_files[index].buffer], {type:mt}));
				obj_i.img.onload = function() {
					URL.revokeObjectURL(this.src);
					count--;
					if(count === 0)source.refresh();
				}
				obj.arr.push(obj_i);
			}
		}
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext("2d");
		source = new ol.source.ImageCanvas({
			canvasFunction:function(ex, n, n2, n3, n4){
				canvas.setAttribute("width", n3[0]);
				canvas.setAttribute("height", n3[1]);
				let dx, dy;
				ctx.clearRect(0, 0, n3[0], n3[1]);
				if(test_rects(ex, obj.ex)){
					for(let i = 0; i < obj.arr.length; i++){
						if(test_rects(ex, obj.arr[i].ex)){
							//[minx, miny, maxx, maxy]
							dx = (obj.arr[i].ex[0] - ex[0]) / n;
							dy = (ex[3] - obj.arr[i].ex[3]) / n;
							ctx.drawImage(obj.arr[i].img, 0, 0, obj.arr[i].img.width, obj.arr[i].img.height, dx, dy, (obj.arr[i].ex[2] - obj.arr[i].ex[0]) / n, (obj.arr[i].ex[3] - obj.arr[i].ex[1]) / n);
						}else continue;
					}
				}
				return canvas;
			}
		});
		let layerImage = new ol.layer.Image({
			source:source
		});
		layerImage.setMap(map.map);
		///
		obj.menu = createElement("div", ["class", "track"]);
		obj.menu.textContent = name.slice(0, -4).slice(0, 34);
		// Кнопка удалить.
		let b_del = createElement("span", ["class", "b_tr_s"]);
		b_del.textContent = "❌";
		b_del.onclick = () => {
			layerImage.setMap(null);
			map_list.removeChild(obj.menu);
		};
		obj.menu.append(b_del);
		// Кнопка центрирования на карте.
		let b_sing = createElement("span", ["class", "b_2"]);
		b_sing.textContent = "●";
		b_sing.onclick = () => map.view.setCenter([(obj.ex[0] + obj.ex[2]) / 2, (obj.ex[1] + obj.ex[3]) / 2]);;
		obj.menu.append(b_sing);
		obj.menu.insertAdjacentHTML('beforeend', "<br>");
		// Ползунок прозрачности.
		let b_opacity = createElement("input", ["type", "range"], ["min", "0"], ["max", "1"], ["step", ".01"], ["value", "1"]);
		b_opacity.oninput = () => {
			layerImage.setOpacity(b_opacity.valueAsNumber);
			layerImage.changed();
		};
		obj.menu.append(b_opacity);
		map_list.appendChild(obj.menu);
		b_sing.onclick();
	};
	
	
	let input_file_kmz = createElement("input", ["type", "file"], ["multiple", ""]);
	let reg_kmz_format = /\.kmz$/i;
	input_file_kmz.onchange = () => {
		for(let i = 0; i < input_file_kmz.files.length; i++){
			// Проверка по фориату(kmz) имени файла.
			if(!reg_kmz_format.test(input_file_kmz.files[i].name))continue;
			let reader = new FileReader();
			reader.onload = () => {
				create_map(from_zip(reader.result), input_file_kmz.files[i].name);
			};
			reader.readAsArrayBuffer(input_file_kmz.files[i]);
		}
	};
	let b_load = document.getElementById("map_load");
	b_load.onclick = () => {
		input_file_kmz.click();
	};
	
	/// СОХРАНЕНИЕ.
	let save_z = document.getElementById("save_z");
	let g_zoom = createElement("span");
		g_zoom.textContent = "zoom ";
	let label_z = createElement("label");
		label_z.textContent = "авто:";
	let auto_z = createElement("input", ["type", "checkbox"], ["checked", true]);
	label_z.append(auto_z);
	g_zoom.append(label_z);
	//g_zoom.insertAdjacentText('beforeend', " zoom:");
	let b_zoom = createElement("input", ["type", "range"], ["min", "0"], ["max", "21"], ["step", "1"]);
	g_zoom.append(b_zoom);
	let out_zoom = createElement("span");
	g_zoom.append(out_zoom);
	b_zoom.oninput = () => {
		out_zoom.textContent = b_zoom.value;
	};
	let f_b_zoom = (int) => {
		out_zoom.textContent = b_zoom.value = int;
	};
	let coor_t_l, coor_b_r;
	let width = 20;
	let offset = 100;
	
	let c_t_l = [offset, offset];//coor_top_left
	let c_b_r = [width_map - offset, height_map - offset];//coor_bot_right
	
	
	let side = 40075017 / 256;// Количество 256 пиксельных тайлов на сторону в веб меркаторе.
	let r_p = 4000;// Разрешение стороны в пикселях, оноже в квадрате будет показывать общее количество пикселей в карте.
	let f_zoom = () => {
		if(auto_z.checked){
			//let area = (coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1]);
			//let resolution = (((c_b_r[0] - c_t_l[0]) * (c_b_r[1] - c_t_l[1])) ** .5) / 4000;
			
			//let resolution = (((coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1])) ** .5) / r_p;
			let zoom = Math.round(Math.log2(side / ((((coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1])) ** .5) / r_p)));
			if(zoom > 21)zoom = 21;
			f_b_zoom(zoom);
			
			
			
			//document.getElementById("test_out").textContent = zoom+" | "+(c_b_r[0] - c_t_l[0])+" | "+(c_b_r[1] - c_t_l[1]);
			//document.getElementById("test_out").textContent = (((coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1])) ** .5) / (((c_b_r[0] - c_t_l[0]) * (c_b_r[1] - c_t_l[1])) ** .5);
			//document.getElementById("test_out").textContent = resolution+" "+(((coor_b_r[0] - coor_t_l[0]) * (coor_t_l[1] - coor_b_r[1])) ** .5) / (((c_b_r[0] - c_t_l[0]) * (c_b_r[1] - c_t_l[1])) ** .5);
			// 100000 = 20
			// 1004358808074786
			// 1000000000000000 = 4
			/*
			if(area < 1000000)f_b_zoom(20);
			else if(area < 10000000)f_b_zoom(10);
			else f_b_zoom(0);
			//*/
		}
	};
	auto_z.onchange = f_zoom;
	
	
	let input_t_l = document.getElementById("input_t_l");
	input_t_l.value = "";
	input_t_l.disabled = true;
	let input_b_r = document.getElementById("input_b_r");
	input_b_r.value = "";
	input_b_r.disabled = true;
	/// SVG рамка, для области сохранения.
	let g_svg = createElementNS("g");
	// Рамка.
	let rail_t_l = create_rail();
	g_svg.appendChild(rail_t_l);
	let rail_t = create_rail();
	g_svg.appendChild(rail_t);
	let rail_t_r = create_rail();
	g_svg.appendChild(rail_t_r);
	let rail_r = create_rail();
	g_svg.appendChild(rail_r);
	let rail_b_r = create_rail();
	g_svg.appendChild(rail_b_r);
	let rail_b = create_rail();
	g_svg.appendChild(rail_b);
	let rail_b_l = create_rail();
	g_svg.appendChild(rail_b_l);
	let rail_l = create_rail();
	g_svg.appendChild(rail_l);
	// События SVG
	let f_coor = () => {
		coor_t_l = map.map.getCoordinateFromPixel(c_t_l);
		coor_b_r = map.map.getCoordinateFromPixel(c_b_r);
	};
	map.map.once('postrender', f_coor);
	let f_c = () => {
		c_t_l = map.map.getPixelFromCoordinate(coor_t_l);
		c_b_r = map.map.getPixelFromCoordinate(coor_b_r);
	};
	
	let rail_draw = () => {
		rail_t_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_t_l[1]+"h-"+width+"v-"+width+"h"+width+"z");
		rail_t.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_t_l[1]+"v-"+width+"h"+(c_b_r[0] - c_t_l[0])+"v"+width+"z");
		rail_t_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_t_l[1]+"v-"+width+"h"+width+"v"+width+"z");
		rail_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_t_l[1]+"h"+width+"v"+(c_b_r[1] - c_t_l[1])+"h-"+width+"z");
		rail_b_r.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_b_r[1]+"h"+width+"v"+width+"h-"+width+"z");
		rail_b.setAttributeNS(null, "d", "M"+c_b_r[0]+","+c_b_r[1]+"v"+width+"h-"+(c_b_r[0] - c_t_l[0])+"v-"+width+"z");
		rail_b_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_b_r[1]+"v"+width+"h-"+width+"v-"+width+"z");
		rail_l.setAttributeNS(null, "d", "M"+c_t_l[0]+","+c_b_r[1]+"h-"+width+"v-"+(c_b_r[1] - c_t_l[1])+"h"+width+"z");
	};
	let _draw = () => {
		f_coor();
		input_t_l.value = to_wgs_84_N_E(coor_t_l);
		input_b_r.value = to_wgs_84_N_E(coor_b_r);
		rail_draw();
		f_zoom();
	};
	rail_t_l.onmousedown = e => {
		m_down(e, e => {
			c_t_l[0] += e.movementX;
			c_t_l[1] += e.movementY;
			if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
			if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
			_draw();
		});
	};
	rail_t.onmousedown = e => {
		m_down(e, e => {
			c_t_l[1] += e.movementY;
			if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
			_draw();
		});
	};
	rail_t_r.onmousedown = e => {
		m_down(e, e => {
			c_b_r[0] += e.movementX;
			c_t_l[1] += e.movementY;
			if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
			if(c_t_l[1] > c_b_r[1])c_b_r[1] = c_t_l[1];
			_draw();
		});
	};
	rail_r.onmousedown = e => {
		m_down(e, e => {
			c_b_r[0] += e.movementX;
			if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
			_draw();
		});
	};
	rail_b_r.onmousedown = e => {
		m_down(e, e => {
			c_b_r[0] += e.movementX;
			c_b_r[1] += e.movementY;
			if(c_t_l[0] > c_b_r[0])c_t_l[0] = c_b_r[0];
			if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
			_draw();
		});
	};
	rail_b.onmousedown = e => {
		m_down(e, e => {
			c_b_r[1] += e.movementY;
			if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
			_draw();
		});
	};
	rail_b_l.onmousedown = e => {
		m_down(e, e => {
			c_t_l[0] += e.movementX;
			c_b_r[1] += e.movementY;
			if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
			if(c_t_l[1] > c_b_r[1])c_t_l[1] = c_b_r[1];
			_draw();
		});
	};
	rail_l.onmousedown = e => {
		m_down(e, e => {
			c_t_l[0] += e.movementX;
			if(c_t_l[0] > c_b_r[0])c_b_r[0] = c_t_l[0];
			_draw();
		});
	};
	let svg = document.getElementById("svg");// слой для рисования.
	let save_check = document.getElementById("save_check");
	save_check.checked = false;
	save_check.onchange = () => {
		if(save_check.checked){
			c_t_l = [offset, offset];
			c_b_r = [width_map - offset, height_map - offset];
			_draw();
			svg.appendChild(g_svg);
			input_t_l.disabled = false;
			input_b_r.disabled = false;
			save_z.appendChild(g_zoom);
		}else{
			input_t_l.disabled = true;
			input_b_r.disabled = true;
			input_t_l.value = "";
			input_b_r.value = "";
			if(svg.contains(g_svg))svg.removeChild(g_svg);
			save_z.removeChild(g_zoom);
		}
	};
	input_t_l.onblur = () => {
		let c = input_t_l.value.split(/[^-0-9\.]+/m, 2).map(toRad);
		let n_N = parseFloat(c[0]);
		let n_E = parseFloat(c[1]);
		if(isFinite(n_N) && isFinite(n_E)){
			coor_t_l = from_wgs_84([c[1], c[0]]);
			if(coor_t_l[0] > coor_b_r[0])coor_b_r[0] = coor_t_l[0];
			if(coor_t_l[1] < coor_b_r[1])coor_b_r[1] = coor_t_l[1];
			f_c();
			rail_draw();
			input_t_l.value = to_wgs_84_N_E(coor_t_l);
		}else input_t_l.value = to_wgs_84_N_E(coor_t_l);
	};
	input_t_l.onkeydown = f_enter;
	input_t_l.onfocus = f_focus;
	input_b_r.onblur = () => {
		let c = input_b_r.value.split(/[^-0-9\.]+/m, 2).map(toRad);
		let n_N = parseFloat(c[0]);
		let n_E = parseFloat(c[1]);
		if(isFinite(n_N) && isFinite(n_E)){
			coor_b_r = from_wgs_84([c[1], c[0]]);
			if(coor_t_l[0] > coor_b_r[0])coor_t_l[0] = coor_b_r[0];
			if(coor_t_l[1] < coor_b_r[1])coor_t_l[1] = coor_b_r[1];
			f_c();
			rail_draw();
			input_b_r.value = to_wgs_84_N_E(coor_b_r);
		}else input_b_r.value = to_wgs_84_N_E(coor_b_r);
	};
	input_b_r.onkeydown = f_enter;
	input_b_r.onfocus = f_focus;
	
	this.f_move = () => {
		if(save_check.checked){
			f_c();
			rail_draw();
		}
	};
	
	
	let save_format = document.getElementById("save_format");
	save_format.selectedIndex = 1;
	
	let b_save = document.getElementById("map_save");
	// Функция сохранения.
	b_save.onclick = () => {
		if(save_check.checked){
			let ex = [coor_t_l[0], coor_b_r[1], coor_b_r[0], coor_t_l[1]];//[minx, miny, maxx, maxy]
			alert(ex);
		}else{
			alert("Установите область сохранения.");
			save_check.click();
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	let canvas = document.getElementById("canvas_test");
	let ctx = canvas.getContext('2d');
	let b_load_test = document.getElementById("load_test");
	
	let image = new Image(60, 45);
	//image.onload = () => {alert("imag")};
	image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
	let count = 0;
	b_load_test.onclick = () => {
		let size = map.map.getSize();
		//canvas.style.width = size[0]+"px";
		canvas.setAttribute("width", size[0]);
		//canvas.style.height = size[1]+"px";
		canvas.setAttribute("height", size[1]);
		let arr = document.querySelectorAll('.ol-layer canvas');
		
		let elm_imag = map.map.getViewport();
		
		map.base_layer.once('postrender', e => {
			//e.context.fillStyle = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(1,7)+"ff";
			//e.context.fillRect(0, 0, 500, 500);
			//alert(e.context.canvas.style.transform);
			//ctx.drawImage(e.context.canvas, 10, 10, 100, 100, 10, 10, 100, 100);
			ctx.drawImage(e.context.canvas, 0, 0, size[0], size[1], 0, 0, size[0], size[1]);
			//let imag = canvas.toDataURL('image/jpeg');
			//*
			e.context.canvas.toBlob(function(file){
				let a = document.createElement("a"),
				url = URL.createObjectURL(file);
				a.href = url;
				a.download = "map.png";
				document.body.appendChild(a);
				a.click();
				setTimeout(() => {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 0); 
			}, "image/png");
			//*/
			//download(e.context.getImageData(60, 60, 200, 100), "map.png", "image/png");
			//download(ctx.getImageData(60, 60, 200, 100), "map.png", "image/png");
			//let src = e.context.canvas.toDataURL("image/png");
			//let img = document.createElement('img');// create a Image Element
			//img.src = src;//image source
			//ctx.drawImage(img, 0, 0);
			//let img = e.context.getImageData(0, 0, 100, 100);
			//ctx.drawImage(img, 0, 0);
			//alert(e.context.getImageData(0, 0, 200, 200));
			//ctx.drawImage(e.context.getImageData(0, 0, 200, 200), 0, 0);
		});
		
		
		//map.map.once('rendercomplete', () => {alert(document.querySelectorAll('.ol-layer canvas').length);})
		
		//alert(arr.length);
		ctx.clearRect(0, 0, 500, 500);
		ctx.fillStyle = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(1,7)+"ff";
		ctx.fillRect(0, 0, 500, 500);
		if(count & 1){
			/*
			Array.prototype.forEach.call(
				document.querySelectorAll('.ol-layer canvas'),
				function (canvas_1) {
					if (canvas_1.width > 0) {
						var opacity = canvas_1.parentNode.style.opacity;
						ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);
						var transform = canvas_1.style.transform;
						// Get the transform parameters from the style's transform matrix
						var matrix = transform
							.match(/^matrix\(([^\(]*)\)$/)[1]
							.split(',')
							.map(Number);
						// Apply the transform to the export map context
						CanvasRenderingContext2D.prototype.setTransform.apply(
							ctx,
							matrix
						);
						ctx.drawImage(canvas_1, 0, 0);
					}
				}
			);
			let imag = canvas.toDataURL('image/jpeg');
			//*/
			
			//ctx.drawImage(elm_imag, 0, 0);
			//ctx.drawImage(arr[0], 0, 0, size[0], size[1], 0, 0, size[0], size[1]);
			//let img = canvas.toDataURL('image/jpeg');
		}else{
			ctx.drawImage(image, 0, 0, 200, 100);
			/*
			map.map.once('rendercomplete', function (){
				let format = "a4";
				var dims = {
					a0: [1189, 841],
					a1: [841, 594],
					a2: [594, 420],
					a3: [420, 297],
					a4: [297, 210],
					a5: [210, 148],
				};
				var dim = dims[format];
				var mapCanvas = document.createElement('canvas');
				mapCanvas.width = size[0];
				mapCanvas.height = size[1];
				var mapContext = mapCanvas.getContext('2d');
				Array.prototype.forEach.call(
					document.querySelectorAll('.ol-layer canvas'),
					function (canvas) {
						if (canvas.width > 0) {
							var opacity = canvas.parentNode.style.opacity;
							mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
							var transform = canvas.style.transform;
							// Get the transform parameters from the style's transform matrix
							var matrix = transform
								.match(/^matrix\(([^\(]*)\)$/)[1]
								.split(',')
								.map(Number);
							// Apply the transform to the export map context
							CanvasRenderingContext2D.prototype.setTransform.apply(
								mapContext,
								matrix
							);
							mapContext.drawImage(canvas, 0, 0);
						}
					}
				);
				var pdf = new jsPDF('landscape', undefined, format);
				pdf.addImage(
					mapCanvas.toDataURL('image/jpeg'),
					'JPEG',
					0,
					0,
					dim[0],
					dim[1]
				);
				pdf.save('map.pdf');
				// Reset original map size
		});//*/
		}
		count++;
	};
	
};