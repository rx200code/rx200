let rx = {};
rx.map = (id, center) => {
	// Элемент в котором будет карта.
	let elm_map = document.getElementById(id);
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
	let to_wgs_84 = c => [rad_90 - 2 * Math.atan(Math.E ** (-c[0] / wgs_84_a)), c[1] / wgs_84_a];// EPSG:1024
	let from_wgs_84 = c => {// EPSG:1024 (lat, lon), (f, l), (широта, долгота).
		let x = Math.tan(c[0]);
		return [Math.log(x + (x * x + 1) ** .5) * wgs_84_a, c[1] * wgs_84_a];
	};
	// Вариант canvas.
	let canvas = document.createElement('canvas');
	canvas.width  = w_m_p;
	canvas.height = h_m_p;
	elm_map.append(canvas);
	let ctx = canvas.getContext("2d");
	// TEST
	ctx.fillStyle = "#888888ff";
	ctx.fillRect(0, 0, w_m_p, h_m_p);
	
	ctx.fillStyle = "#0000ffff";
	ctx.fillRect(100, 100, 100, 100);
	let m_down = (e, f) => {
		e.preventDefault();
		let onMouseUp = e => {
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', f);
		};
		document.addEventListener('mousemove', f);
		document.addEventListener('mouseup', onMouseUp);
	};
	let move_x = 0;
	let	move_y = 0;
	canvas.onmousedown = e => {
		//move_x = e.offsetX + e.pageX;
		//move_y = e.offsetY + e.pageY;
		//move_x = 0;
		//move_y = 0;
		m_down(e, e => {
			move_x = e.movementX;
			move_y = e.movementY;
			
			//ctx.translate(move_x, move_y);
			//ctx.strokeStyle = "#888888ff";
			//ctx.lineWidth = Math.max(Math.abs(e.movementX), Math.abs(e.movementY)) * 2;
			//ctx.strokeRect(0, 0, w_m_p, h_m_p);
			//ctx.stroke();
			
			ctx.drawImage(canvas, e.movementX, e.movementY);
			//ctx.putImageData(ctx.getImageData(0, 0, w_m_p, h_m_p), move_x, move_y);
			
			//ctx.drawImage(canvas, 0, 0);
			//ctx.setTransform(1, 0, 0, 1, 0, 0);
			
			//ctx.translate(move_x, move_y);
			//ctx.transform(1, .2, .8, 1, 0, 0);
			out("x = "+move_x+"<br>y = "+move_y);
		});
	};
	// END TEST
	
	
	//alert(w_m+"\n"+h_m);
};