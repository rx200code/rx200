// определяем размеры.
const wgs_84_a = 6378137;
const rad_90 = Math.PI / 2;
const r_1 = Math.PI / 180;
const width_WM = Math.PI * 2 * wgs_84_a;// 40075017 // 40075016.68557849 // ширена нулевого слайда в ВМ.
const size_t = 256;
let toRad = deg => deg * r_1;
let toDeg = rad => rad / r_1;
/// WGS 84
let to_wgs_84 = c => [rad_90 - 2 * Math.atan(Math.E ** (-c[1] / wgs_84_a)), c[0] / wgs_84_a];// EPSG:1024
let to_wgs_84_deg = c => [toDeg(rad_90 - 2 * Math.atan(Math.E ** (-c[1] / wgs_84_a))), toDeg(c[0] / wgs_84_a)];// EPSG:1024
let from_wgs_84 = c => {// EPSG:1024 (lat, lon), (f, l), (широта, долгота).
	let x = Math.tan(c[0]);
	return [c[1] * wgs_84_a, Math.log(x + (x * x + 1) ** .5) * wgs_84_a];// x, y
};
let m_down = (e, f) => {
	e.preventDefault();
	let onMouseUp = e => {
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('mousemove', f);
	};
	document.addEventListener('mousemove', f);
	document.addEventListener('mouseup', onMouseUp);
};

let rx = {};
rx.map = (id, center) => {
	let elm_map = document.getElementById(id);// Элемент в котором будет карта.
	elm_map.setAttribute("class", "rx_map");
	let w_m_p = elm_map.clientWidth;// ширена в пикселях
	let h_m_p = elm_map.clientHeight;// высота в пикселях
	// CANVAS
	let canvas = document.createElement('canvas');
	canvas.width = w_m_p;
	canvas.height = h_m_p;
	elm_map.append(canvas);
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#888888ff";
	ctx.fillRect(0, 0, w_m_p, h_m_p);
	
	/// определяем положение на экране.
	let center_WM = from_wgs_84([toRad(center[0]), toRad(center[1])]);// Центер в веб меркаторе.
	let center_WM_t = [center_WM[0] + (width_WM / 2), width_WM - (center_WM[1] + (width_WM / 2))];// Центер в системе координат тайлов.
	
	let zoom = center[2];// зум
	let zoom_tile = Math.ceil(zoom);// зум тайлов.
	
	// разрешение.
	let res = width_WM / (size_t * (2 ** zoom));// Разрешение.
	let res_t = width_WM / (size_t * (2 ** zoom_tile));// Разрешение в тайлах.
	
	// соотношение.
	let ratio = res_t / res;
	
	// Положение левого верхнего угла, в системе координат тайлов.
	
	
	let x_min = center_WM_t[0] - (w_m_p / 2 * res);
	let y_max = center_WM_t[1] - (h_m_p / 2 * res);
	
	
	
	let c_left_top = [x_min, y_max];// в системе координат тайлов // всегда должны быть актуальными, относительно их и будет считаться все остальное.
	
	
	let c_center = to_wgs_84_deg([(c_left_top[0] - (width_WM / 2)) + (w_m_p / 2 * res), ((width_WM - c_left_top[1]) - (width_WM / 2)) - (h_m_p / 2 * res)]);
	out("x = "+c_center[1]+"<br>y = "+c_center[0]+"<br>z = "+zoom);
	
	// размер тайла на экране в пикселях при данном зуме.
	let size_t_view = Math.round(size_t * ratio);
	
	
	
	
	
	/// Настраиваем тайлы, и загружаем начальное изображение карты.
	
	
	let w_tile_WM = width_WM / (2 ** zoom_tile);// Размер тайла в системе координат тайлов.
	//let w_tile_WM = size_t * res_t;// Размер тайла в системе координат тайлов.
	
	
	
	// Смещение первого тайла в пикселях экрана относительно левого верхнего угла карты.
	let offset_left = -(((c_left_top[0] % w_tile_WM)) / res_t * ratio);
	let offset_top = -(((c_left_top[1] % w_tile_WM)) / res_t * ratio);
	
	
	let ctx_x = Math.round(offset_left);
	let ctx_y = Math.round(offset_top);
	// Номер x и y левого верхнего тайла.
	let tile_x = Math.floor(c_left_top[0] / w_tile_WM);// | 0;// start_tile_width //
	let tile_y = Math.floor(c_left_top[1] / w_tile_WM);// | 0;// start_tile_height //
	
	//alert(ctx_y);
	
	
	// вычисляем максимальное количество тайлов.
	let tiles_count = Math.ceil(w_m_p / (size_t / 2)) * Math.ceil(h_m_p / (size_t / 2));
	// массиы картинок.
	let imgs = [];
	// создаём нужное количество картинок.
	while(tiles_count--){
		let img = new Image(size_t, size_t);
		imgs.push(img);
	}
	
	/// ОШИБКИ, осталось с точностью до внутрепиксельной решить положение тайлов и их размер.
	let arr_s = ["a","b","c"];
	let count_i = 0;
	
	let count_x = 0;
	let count_y = 0;
	
	imgs.forEach(img => {
		img.ctx_x = ctx_x + (count_x * size_t_view);
		img.ctx_y = ctx_y + (count_y * size_t_view);
		
		img.tile_x = tile_x + count_x;
		img.tile_y = tile_y + count_y;
		
		img.onload = () => {
			//ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);
			ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);// доделать для выявления точного положения в пикселе.// при зоме 15.99 отображается некоректно.
			// Возможно лучшим решением будет создание отдельного слоя а потом масштабирование.
		};
		
		
		if(ctx_x + (count_x * size_t_view) >= w_m_p){
			img.flag_view = false;
		}else{
			img.flag_view = true;
			img.src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom_tile+'/'+img.tile_x+'/'+img.tile_y+'.png';
			count_i++;
		}
		
		count_y++;
		if(ctx_y + (count_y * size_t_view) >= h_m_p){
			count_y = 0;
			count_x++;
		}
		
	});
	
	
	
	
	
	
	/// Move
	
	let tile_w = Math.ceil(w_m_p / size_t_view + 1);
	let tile_h = Math.ceil(h_m_p / size_t_view + 1);
	let limit_left = (tile_w - 1) * size_t_view;
	let limit_w = limit_left + size_t_view;
	let limit_top = (tile_h - 1) * size_t_view;
	let limit_h = limit_top + size_t_view;
	
	elm_map.onmousedown = e => {
		m_down(e, e => {
			let move_x = e.movementX;
			let move_y = e.movementY;
			// zoom
			c_left_top[0] -= move_x * res;// исправить.
			c_left_top[1] -= move_y * res;// исправить.
			
			ctx.fillRect(0, 0, w_m_p, h_m_p);
			imgs.forEach(img => {
				if(img.flag_view){
					let flag_offset = false;
					//let left = img.offsetLeft + move_x;
					let left = img.ctx_x + move_x;
					if(left > limit_left){
						flag_offset = true;
						img.tile_x -= tile_w;
						left -= limit_w;
					}else if(left < -size_t_view){
						flag_offset = true;
						img.tile_x += tile_w;
						left += limit_w;
					}
					
					//let top = img.offsetTop + move_y;
					let top = img.ctx_y + move_y;
					if(top > limit_top){
						flag_offset = true;
						img.tile_y -= tile_h;
						top -= limit_h;
					}else if(top < -size_t_view){
						flag_offset = true;
						img.tile_y += tile_h;
						top += limit_h;
					}
					if(flag_offset){
						img.src = '';
						img.src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom_tile+'/'+img.tile_x+'/'+img.tile_y+'.png';
						count_i++;
					}
					
					img.ctx_x = left;
					img.ctx_y = top;
					ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);
					//img.style.left = left+"px";
					//img.style.top = top+"px";
				}
			});
			
			//out("x = "+move_x+"<br>y = "+move_y);
			c_center = to_wgs_84_deg([(c_left_top[0] - (width_WM / 2)) + (w_m_p / 2 * res), ((width_WM - c_left_top[1]) - (width_WM / 2)) - (h_m_p / 2 * res)]);
			out("x = "+c_center[1]+"<br>y = "+c_center[0]+"<br>z = "+zoom);
		});
	};
	
	/// zoom
	
	let x_offset_wheel = elm_map.getBoundingClientRect().left;
	let y_offset_wheel = elm_map.getBoundingClientRect().top;
	
	let step = 0.25;
	
	elm_map.onwheel = event => {
		//Положение курсора относительно окна карты.
		let cursor_offsetX = event.clientX - x_offset_wheel;
		let cursor_offsetY = event.clientY - y_offset_wheel;
		
		c_left_top[0] += cursor_offsetX * res;
		c_left_top[1] += cursor_offsetY * res;
		
		
		
		zoom -= step * Math.sign(event.deltaY);//Для совместимости браузеров, от дельты берем только знак.
		zoom_tile = Math.ceil(zoom);// зум тайлов.
		
		
		
		
		res = width_WM / (size_t * (2 ** zoom));// Разрешение.
		res_t = width_WM / (size_t * (2 ** zoom_tile));// Разрешение в тайлах.
		
		c_left_top[0] -= cursor_offsetX * res;
		c_left_top[1] -= cursor_offsetY * res;
		
		
		
		// соотношение.
		ratio = res_t / res;
		size_t_view = Math.round(size_t * ratio);
		
		
		w_tile_WM = width_WM / (2 ** zoom_tile);// Размер тайла в системе координат тайлов.
		
		
		
		// Смещение первого тайла в пикселях экрана относительно левого верхнего угла карты.
		offset_left = -(((c_left_top[0] % w_tile_WM)) / res_t * ratio);
		offset_top = -(((c_left_top[1] % w_tile_WM)) / res_t * ratio);
		
		
		ctx_x = Math.round(offset_left);
		ctx_y = Math.round(offset_top);
		
		
		
		tile_x = Math.floor(c_left_top[0] / w_tile_WM);
		tile_y = Math.floor(c_left_top[1] / w_tile_WM)
		
		
		
		
		
		
		
		// for move
		tile_w = Math.ceil(w_m_p / size_t_view + 1);
		tile_h = Math.ceil(h_m_p / size_t_view + 1);
		limit_left = (tile_w - 1) * size_t_view;
		limit_w = limit_left + size_t_view;
		limit_top = (tile_h - 1) * size_t_view;
		limit_h = limit_top + size_t_view;
		
		
		
		
		
		
		let count_x = 0;
		let count_y = 0;
		
		imgs.forEach(img => {
			img.ctx_x = ctx_x + (count_x * size_t_view);
			img.ctx_y = ctx_y + (count_y * size_t_view);
			
			img.tile_x = tile_x + count_x;
			img.tile_y = tile_y + count_y;
			
			img.onload = () => {
				//ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);
				ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);// доделать для выявления точного положения в пикселе.// при зоме 15.99 отображается некоректно.
				// Возможно лучшим решением будет создание отдельного слоя а потом масштабирование.
			};
			
			
			if(ctx_x + (count_x * size_t_view) >= w_m_p){
				img.flag_view = false;
			}else{
				img.flag_view = true;
				img.src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom_tile+'/'+img.tile_x+'/'+img.tile_y+'.png';
				count_i++;
			}
			
			count_y++;
			if(ctx_y + (count_y * size_t_view) >= h_m_p){
				count_y = 0;
				count_x++;
			}
			
		});
		
		c_center = to_wgs_84_deg([(c_left_top[0] - (width_WM / 2)) + (w_m_p / 2 * res), ((width_WM - c_left_top[1]) - (width_WM / 2)) - (h_m_p / 2 * res)]);
		out("x = "+c_center[1]+"<br>y = "+c_center[0]+"<br>z = "+zoom);
	};
	
	
	
	//out("x = "+ex[0]+"<br>y = "+ex[3]+"<br>"+res);
	// Поставим точку в центре.
	let point = document.createElement("span");
	point.setAttribute("class", "rx_test");
	point.style.left = (w_m_p / 2 - 2.5)+"px";
	point.style.top = (h_m_p / 2 - 2.5)+"px";
	
	elm_map.append(point);
};