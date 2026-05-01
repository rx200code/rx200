const size_tile = 256;
const r_1 = Math.PI / 180;
function from_wm_x_v1(lon, zoom){
	let tile_count = Math.pow(2,zoom - 1);// количество тайлов
	let pixel_count = tile_count * size_tile;// количество пикселей
	return Math.floor((lon / 180 + 1) * pixel_count);
}

function from_wm_x_v2(lon, zoom){
	let zz = size_tile / (2 * Math.PI) * (2 << zoom)  * (Math.PI / 180) / 2;
	return zz * (lon + 180);// | 0;
}

function from_wm_x_v3(lon, zoom){
	return ((lon + 180) / 360) * (size_tile << zoom) | 0;
}

function from_wm_y_v1(lat, zoom){
	return Math.floor((1 - Math.asinh(Math.tan(lat * r_1)) / Math.PI) * Math.pow(2,zoom - 1) * size_tile);
	//return Math.floor((1 - Math.asinh(Math.tan(lat * r_1)) / Math.PI) * Math.pow(2,zoom - 1));
}

function from_wm_y_v2(lat, zoom){
	const wgs_84_a = 6378137;
	const width_WM = Math.PI * 2 * wgs_84_a;
	let x = Math.tan(lat * r_1);
	let center_WM_t = width_WM - (Math.log(x + (x * x + 1) ** .5) * wgs_84_a + (width_WM / 2));
	//let res = width_WM / (size_tile * (2 ** zoom));// Разрешение.
	let w_tile_WM = width_WM / (2 ** zoom);
	return Math.floor(center_WM_t / w_tile_WM * size_tile);
	//return Math.floor(center_WM_t / w_tile_WM);
}

function from_wm_y_v3(lat, zoom){
	let zz = size_tile / (2 * Math.PI) * (1 << zoom);
	return zz * (Math.PI - Math.log(Math.tan(Math.PI / 4 + (lat * r_1) / 2))) | 0;
	//return zz * (Math.PI - Math.log(Math.tan(Math.PI / 4 + (lat * r_1) / 2))) / size_tile | 0;
}


function time_func_v1(f, ...arr){
	let time = performance.now();
	f(...arr);
	return performance.now() - time;
}

function time_func_v2(f, zoom){
	let i = 1000000;
	let time = performance.now();
	while(i){
		f(i % 180, zoom);
		--i;
	}
	return performance.now() - time;
}

function from_wm(lat, lon, zoom){
	let text = "lat: " + lat + "<br>lon: " + lon + "<br>zoom: " + zoom + "<br>";
	
	text += "x_v1: " + from_wm_x_v1(lon, zoom) + "<br>";
	text += "x_v2: " + from_wm_x_v2(lon, zoom) + "<br>";
	text += "x_v3: " + from_wm_x_v3(lon, zoom) + "<br>";
	/**
	text += "x_v1: " + time_func_v1(from_wm_x_v1, lon, zoom) + "<br>";
	text += "x_v2: " + time_func_v1(from_wm_x_v2, lon, zoom) + "<br>";
	text += "x_v3: " + time_func_v1(from_wm_x_v3, lon, zoom) + "<br>";

	text += "x_v1: " + time_func_v2(from_wm_x_v1, zoom) + "<br>";
	text += "x_v2: " + time_func_v2(from_wm_x_v2, zoom) + "<br>";
	text += "x_v3: " + time_func_v2(from_wm_x_v3, zoom) + "<br>";
	//*/
	text += "y_v1: " + from_wm_y_v1(lat, zoom) + "<br>";
	text += "y_v2: " + from_wm_y_v2(lat, zoom) + "<br>";
	text += "y_v3: " + from_wm_y_v3(lat, zoom) + "<br>";


	out(text);
}












