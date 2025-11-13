const size_tile = 256;
const max_zoom = 18;
const rad_1 = Math.PI / 180;// 360
var zoom_pixels = [size_tile];
var zoom_tiles = [1];

/*
https://tile.openstreetmap.org/zoom/x/y.png
//*/

for(let i = 1; i <= max_zoom; i++){
	zoom_pixels[i] = zoom_pixels[i - 1] * 2;
	zoom_tiles[i] = zoom_tiles[i - 1] * 2;
}

function toTile(lon, lat, z){
	let b = lat * rad_1;
	let yy = .5 / Math.PI * (2 ** z);

	return [
		zoom_tiles[z] * (lon / 180 + 1) | 0,
		zoom_tiles[z] * (yy * (Math.PI - Math.log(Math.tan((Math.PI / 4) + (b / 2))))) | 0,
		z
	];
}

//function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lon2tile(lon,zoom) { return (Math.floor((lon / 180 + 1)*Math.pow(2,zoom - 1))); }
/*
function lat2tile(lat,zoom) { return (
	Math.floor(
		(1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)
	)
);}//*/
/*
function lat2tile(lat,zoom) { return (
	Math.floor(
		(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)
	)
);}//*/
function lat2tile(lat,zoom) { return (
	Math.floor(
		(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI) * Math.pow(2,zoom - 1)
	)
);}
let arr = [lon2tile(83,16), lat2tile(55,16), 16];
/*
https://tile.openstreetmap.org/16/47877/20728.png
https://tile.openstreetmap.org/16/95755/1358488987.png
//*/


//arr = toTile(83, 55, 16);

//alert("https://tile.openstreetmap.org/" + arr[2] + "/" + arr[0] + "/" + arr[1] + ".png");
 	

function init_map(elm){
	let r_1 = Math.PI / 180;
	// Вводные для отображения.
	let lon = 83;
	let lat = 55;
	let zoom = 0;
	let angle = 0;

	let elm_view = elm;
	elm_view.innerHTML = "";
	elm_view.style.padding = "0px";
	elm_view.style.backgroundColor = "#888";

	elm_view.style.overflow = "hidden";
	elm_view.style.position = "relative";
	let width = elm_view.clientWidth;
	let height = elm_view.clientHeight;
	// Смещение центра
	let shift_center_x = width / 2 | 0;
	let shift_center_y = height / 2 | 0;

	//// определяем координаты центра.

	const size_tile = 256;// размер тайла
	let tile_count = Math.pow(2,zoom - 1);// количество тайлов
	let pixel_count = tile_count * size_tile;// количество пикселей

	//alert(Math.pow(2,0));
	//alert(pixel_count + "\n" + (size_tile << zoom));
	//alert((lon / 180 + 1) + "\n" + ((lon + 180) / 180));
	let pixel_count_2 = size_tile << zoom;// количество тайлов, мах zoom 23, так как 256 занимает 9 бит, в суме 32
	let center_pixel_x_2 = ((lon + 180) / 360) * pixel_count_2 | 0;
	let center_pixel_y_2 = Math.floor((Math.asinh(Math.tan(( (lat + 90) / 180 )*r_1))/Math.PI) * pixel_count_2);

	//alert((lat*Math.PI/180) + "\n" + (lat * (Math.PI / 180)));

	let center_pixel_x = Math.floor((lon / 180 + 1) * pixel_count);// пиксель в центре по оси x
	let center_pixel_y = Math.floor((1-Math.asinh(Math.tan(lat*r_1))/Math.PI) * pixel_count);// пиксель в центре по оси y


	alert( Math.asinh(Math.tan(89*r_1)) / Math.PI );


	//alert(center_pixel_x_2 + "\n" + center_pixel_x);
	alert(center_pixel_y_2 + "\n" + center_pixel_y);

	// пиксели левого верхнего угла.
	let left = center_pixel_x - shift_center_x;
	let top = center_pixel_y - shift_center_y;
	// координаты тайла левого верхнего угла.
	let left_tile = left / size_tile | 0;
	let top_tile = top / size_tile | 0;
	// координаты тайла правого нижнего угла.
	let right_tile = (left + width) / size_tile | 0;
	let bottom_tile = (top + height) / size_tile | 0;
	// смещение тайла относительно левого верхнего угла.
	let left_shift_tile = left % size_tile;
	let top_shift_tile = top % size_tile;

	// Заполняем тайлами область отображения.
	//alert(top_tile - bottom_tile);
	//alert(left_tile - right_tile);
	let y_shift = top_shift_tile - size_tile;
	let x_shift = left_shift_tile - size_tile;
	for(let y = top_tile; y <= bottom_tile; y++, y_shift += size_tile){
		for(let x = left_tile; x <= right_tile; x++, x_shift += size_tile){
			let elm = new Image(size_tile, size_tile);
			elm.style.left = x_shift + 'px';
			elm.style.top = y_shift + 'px';
			elm.style.position = 'absolute';
			//elm.style.opacity = .5;
			elm.src = "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";
			elm_view.appendChild(elm);
			//alert(elm.src);
		}
		x_shift = left_shift_tile - size_tile;
	}


}




//alert("test");