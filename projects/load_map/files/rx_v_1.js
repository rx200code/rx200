let rx = {};
rx.map = (id, center) => {
	// Элемент в котором будет карта.
	let elm_map = document.getElementById(id);
	elm_map.setAttribute("class", "rx_map");
	let w_m_p = elm_map.clientWidth;
	let h_m_p = elm_map.clientHeight;
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
	// Вариант div.
	let start_left = -size_t;
	//let start_top = -size_t;
	let title_w = Math.ceil(w_m_p / size_t + 2);
	let title_h = Math.ceil(h_m_p / size_t + 2);
	
	//alert(title_w+"\n"+title_h);
	let limit_left = (title_w - 1) * size_t;
	let limit_w = limit_left + size_t;
	let limit_top = (title_h - 1) * size_t;
	let limit_h = limit_top + size_t;
	
	
	let imgs = [];
	let w = title_w;
	while(w--){
		let h = title_h;
		let start_top = -size_t;
		while(h--){
			let img = new Image(size_t, size_t);
			img.style.left = start_left+"px";
			img.style.top = start_top+"px";
			elm_map.append(img);
			imgs.push(img);
			start_top += size_t;
		}
		start_left += size_t;
	}
	
	//let box = imgs[0].getBoundingClientRect();
	//alert(JSON.stringify(box));
	//alert(imgs[0].offsetTop);
	
	/// определяем смещение тайлов.
	let center_WM = from_wgs_84([toRad(center[0]), toRad(center[1])]);// Центер в вкб меркаторе.
	let zoom = center[2];
	let res = width_WM / (size_t * (2 ** zoom));// Разрешение.
	// координаты сторон.
	let x_min = center_WM[0] - (w_m_p / 2 * res);
	let x_max = center_WM[0] + (w_m_p / 2 * res);
	let y_min = center_WM[1] - (h_m_p / 2 * res);
	let y_max = center_WM[1] + (h_m_p / 2 * res);
	
	//alert(to_wgs_84(center_WM).map(toDeg));
	
	let ex = [x_min, y_min, x_max, y_max];// x_min, y_min, x_max, y_max
	
	let w_title_WM = size_t * res;
	
	//alert(ex.map(c => c+"\n"));
	
	let offset_left = -Math.round(((ex[0] + (width_WM / 2)) % w_title_WM) / res);
	let offset_top = -Math.round(((width_WM - (ex[3] + width_WM / 2)) % w_title_WM) / res);
	// Устанавливаем смещение и загружаем титлы.
	let arr_s = ["a","b","c"];
	let count_i = 0;
	imgs.forEach(img => {
		let left = img.offsetLeft + offset_left;
		if(left > limit_left)left -= limit_w;
		else if(left < -size_t)left += limit_w;
		
		let top = img.offsetTop + offset_top;
		if(top > limit_top)top -= limit_h;
		else if(top < -size_t)top += limit_h;
		
		
		img.style.left = left+"px";
		img.style.top = top+"px";
		// Устанавливаем src
		
		img.title_x = Math.round(((ex[0] + left * res) + (width_WM / 2)) / w_title_WM);// | 0;// start_title_width //
		img.title_y = Math.round((width_WM - ((ex[3] - top * res) + width_WM / 2)) / w_title_WM);// | 0;// start_title_height //
		img.src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom+'/'+img.title_x+'/'+img.title_y+'.png';
		count_i++;
	});
	// Поставим точку в центре.
	let point = document.createElement("span");
	point.setAttribute("class", "rx_test");
	point.style.left = (w_m_p / 2)+"px";
	point.style.top = (h_m_p / 2)+"px";
	
	elm_map.append(point);
	
	
	elm_map.onmousedown = e => {
		m_down(e, e => {
			move_x = e.movementX;
			move_y = e.movementY;
			
			imgs.forEach(img => {
				let flag_offset = false;
				let left = img.offsetLeft + move_x;
				if(left > limit_left){
					flag_offset = true;
					img.title_x -= title_w;
					left -= limit_w;
				}else if(left < -size_t){
					flag_offset = true;
					img.title_x += title_w;
					left += limit_w;
				}
				
				let top = img.offsetTop + move_y;
				if(top > limit_top){
					flag_offset = true;
					img.title_y -= title_h;
					top -= limit_h;
				}else if(top < -size_t){
					flag_offset = true;
					img.title_y += title_h;
					top += limit_h;
				}
				if(flag_offset){
					img.src = '';
					img.src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom+'/'+img.title_x+'/'+img.title_y+'.png';
				}
				
				img.style.left = left+"px";
				img.style.top = top+"px";
			});
			
			out("x = "+move_x+"<br>y = "+move_y);
		});
	};
	
	//alert(imgs.length);
	//alert(imgs.length);
	//alert(w_m_p+"\n"+h_m_p);
};