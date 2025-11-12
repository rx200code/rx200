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
	// Элемент в котором будет карта.
	let elm_map = document.getElementById(id);
	elm_map.setAttribute("class", "rx_map");
	let w_m_p = elm_map.clientWidth;
	let h_m_p = elm_map.clientHeight;
	/// определяем смещение тайлов.
	let center_WM = from_wgs_84([toRad(center[0]), toRad(center[1])]);// Центер в веб меркаторе.
	let zoom = center[2];
	let zoom_tile = Math.ceil(zoom);
	
	let xxx_zoom = 1 - zoom % 1;
	if(xxx_zoom === 1)xxx_zoom = 0;
	
	
	//let res = width_WM / (size_t * (2 ** zoom));// Разрешение.
	let res_t = width_WM / (size_t * (2 ** zoom_tile));// Разрешение.
	//let res = res_t / 1 + (res_t / 1) * (zoom % 1);// Разрешение.
	let res = res_t * (1 + xxx_zoom);// Разрешение.
	//alert(res_t+"\n"+res+"\n"+(res_t * 1.5));
	// координаты сторон.
	let x_min = center_WM[0] - (w_m_p / 2 * res);
	let y_max = center_WM[1] + (h_m_p / 2 * res);
	//alert(x_min+" "+y_max);// похоже что верно.
	//alert(res+"\n"+(width_WM / (size_t * (2 ** zoom))));
	//return;
	
	// Система координат тайлов  WM + (width_WM / 2) от 0 до width_WM по любой из осей.
	// Основные переменные в системе координат тайлов, это верхний левый угол экрана.
	let c_left_top = [x_min + (width_WM / 2), width_WM - (y_max + (width_WM / 2))];// в системе координат тайлов // всегда должны быть актуальными, относительно их и будет считаться все остальное.
	
	
	// вычисляем количество тайлов.
	let tiles_count = Math.ceil(w_m_p / (size_t / 2)) * Math.ceil(h_m_p / (size_t / 2));
	
	
	// CANVAS
	let canvas = document.createElement('canvas');
	canvas.width = w_m_p;
	canvas.height = h_m_p;
	elm_map.append(canvas);
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#888888ff";
	ctx.fillRect(0, 0, w_m_p, h_m_p);
	
	
	// массиы картинок.
	let imgs = [];
	
	while(tiles_count--){
		let img = new Image(size_t, size_t);
		/*
		img.onload = () => {
			ctx.drawImage(img, img.ctx_x, img.ctx_y, img.size, img.size);
		};
		//*/
		imgs.push(img);
	}
	
	
	/// Настраиваем тайлы, и загружаем начальное изображение карты.
	//let remainder = zoom % 1;// Остаток.
	//if(remainder === 0)remainder = 1;
	
	let remainder = 1 + xxx_zoom;
	
	//let size_t_view = size_t / 2 + (size_t / 2) * remainder;// размер тайлов в отображении.
	let size_t_view = size_t * (1 / remainder);// размер тайлов в отображении.
	
	//alert(size_t_view);
	
	//alert(remainder+"\n"+(res_t / res));
	//alert(res_t+"\n"+res);
	//alert(res_t+"\n"+(res * (remainder / 2 + .5)));
	
	//return;
	
	let w_title_WM = size_t * res_t;
	
	let w_title_WM_2 = size_t_view * res;//
	//alert(w_title_WM+"\n"+w_title_WM_2);
	
	//return;
	
	//let offset_left = -Math.round(((c_left_top[0] % w_title_WM) / res_t) * (remainder / 2 + .5));
	//let offset_top = -Math.round(((c_left_top[1] % w_title_WM) / res_t) * (remainder / 2 + .5));
	
	//let offset_left = -Math.round(((c_left_top[0] % w_title_WM)) / res);
	//let offset_top = -Math.round(((c_left_top[1] % w_title_WM)) / res);
	let offset_left = -(((c_left_top[0] % w_title_WM)) / res);
	let offset_top = -(((c_left_top[1] % w_title_WM)) / res);
	
	// вычисляем количество тайлов по каждой оси.
	let ctx_x = offset_left;
	let ctx_y = offset_top;
	let tile_x = Math.floor(c_left_top[0] / w_title_WM);// | 0;// start_title_width //
	let tile_y = Math.floor(c_left_top[1] / w_title_WM);// | 0;// start_title_height //
	
	
	/*
	let img = new Image(size_t, size_t);
	img.onload = () => {
		ctx.drawImage(img, img.ctx_x, img.ctx_y, size_t_view, size_t_view);
		//ctx.drawImage(img, 100, 100, size_t_view, size_t_view);
	};
	img.ctx_x = offset_left;
	img.ctx_y = offset_top;
	img.tile_x = Math.round(c_left_top[0] / w_title_WM);// | 0;// start_title_width //
	img.tile_y = Math.round(c_left_top[1] / w_title_WM);// | 0;// start_title_height //
	img.src = 'https://a.tile.openstreetmap.org/'+zoom_tile+'/'+img.tile_x+'/'+img.tile_y+'.png';
	//*/
	
	
	
	//size_t_view = Math.round(size_t_view);
	// floor round ceil
	
	
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
			ctx.drawImage(img, Math.round(img.ctx_x), Math.round(img.ctx_y), Math.ceil(size_t_view), Math.ceil(size_t_view));// доделать для выявления точного положения в пикселе.// при зоме 15.99 отображается некоректно.
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
	
	//out("x = "+ex[0]+"<br>y = "+ex[3]+"<br>"+res);
	// Поставим точку в центре.
	let point = document.createElement("span");
	point.setAttribute("class", "rx_test");
	point.style.left = (w_m_p / 2 - 2.5)+"px";
	point.style.top = (h_m_p / 2 - 2.5)+"px";
	
	elm_map.append(point);
};