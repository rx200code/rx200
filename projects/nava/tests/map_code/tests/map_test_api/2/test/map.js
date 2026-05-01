function Map(id_map){
	// Доп. функции, настройки.
	let createElementNS = (name) => document.createElementNS("http://www.w3.org/2000/svg", name);
	// Готовим див куда поместим карту.
	this.div = document.getElementById(id_map);
	while(this.div.firstChild)this.div.removeChild(this.div.lastChild);
	this.div.style.padding = "0px";
	// Настраиваеи место для карты.
	this.svg = createElementNS("svg");
	this.svg.setAttributeNS(null,'height', this.div.clientHeight);
	this.svg.setAttributeNS(null,'width', this.div.clientWidth);
	this.svg.style.position = "inherit";
	this.div.appendChild(this.svg);
	// Настройки вида временно.
	this.zoom = 15;
	this.lat = 55;
	this.lon = 83;
	this.height_px = this.svg.clientHeight;
	this.width_px = this.svg.clientWidth;
	this.width_tile = 256;
	this.height_tile = 256;
	
	this.lon_rad = this.lon * Math.PI / 180;
	this.lat_rad = this.lat * Math.PI / 180;
	// Определяем центр
	
	let zz = this.height_tile / (2 * Math.PI) * Math.pow(2, this.zoom);
	let x_center = zz * (this.lon_rad + Math.PI);// | 0;
	let y_center = zz * (Math.PI - Math.log(Math.tan(Math.PI / 4 + this.lat_rad / 2)));// | 0;
	// Определяем углы
	let x_left = x_center - this.width_px / 2;
	//let x_right = x_left + this.width_px;
	let y_top = y_center - this.height_px / 2;
	//let y_bottom = y_top + this.height_px;
	// определяем количество титлов по осям.
	let img_count_x = (this.width_px / this.width_tile + 1) | 0;
	let img_count_y = (this.height_px / this.height_tile + 1) | 0;
	// определяем номера x и y углового титла.
	let img_x = x_left / this.width_tile | 0;
	let img_y = y_top / this.height_tile | 0;
	// определяем положение первого тайла относительно области просмотра.
	let img_pos_x = img_x * this.width_tile - x_left;
	let img_pos_y = img_y * this.height_tile - y_top;
	
	
	/// загружаем и отображаем рисунки.
	let arr_s = ["a","b","c"];
	//let arr_s = ["0","1","2","3"];// google
	let count_i = 0;
	for(let w = 0; w <= img_count_x; w++){
		for(let h = 0; h <= img_count_y; h++){
			/*
			let img = createElementNS("rect");
			img.setAttributeNS(null,'fill', '#3366CC');
			//*/
			let img = createElementNS("image");
			img.setAttributeNS(null,'width', this.width_tile);
			img.setAttributeNS(null,'height', this.height_tile);
			img.setAttributeNS(null,'x', img_pos_x + w * this.width_tile);
			img.setAttributeNS(null,'y', img_pos_y + h * this.height_tile);
			
			img.setAttributeNS(null,'href', 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+this.zoom+'/'+(img_x + w)+'/'+(img_y + h)+'.png');
			//img.setAttributeNS(null,'href', 'https://khms'+arr_s[count_i % arr_s.length]+'.googleapis.com/kh?v=878&hl=ru-RU&x='+(img_x + w)+'&y='+(img_y + h)+'&z='+this.zoom);// google
			//http://mt1.google.com/vt/lyrs=y&x=1325&y=3143&z=13
			
			this.svg.appendChild(img);
			count_i++;
		}
	}
	
	
	
	
	
	//this.height_tile / (2 * Math.PI) * Math.pow(2, this.zoom) * (this.lon_rad + Math.PI) | 0;
	//(this.lon_rad + Math.PI) / (2 * Math.PI) * Math.pow(2, this.zoom) | 0;
	//alert(this.height_tile / (2 * Math.PI) * Math.pow(2, this.zoom) * (this.lon_rad + Math.PI) | 0);
	//1532086
	//5984
	// 1532086 / 5984 = 256.03041443850265;
	//alert((1532086 + this.width_px / 2) / 256 | 0);// = 5987
	// https://a.tile.openstreetmap.org/13/5987/2591.png
	//alert((1532086 - this.width_px / 2) / 256 | 0);// = 5981
	// https://a.tile.openstreetmap.org/13/5981/2591.png
	//let x = (this.lon_rad+Math.PI)/(Math.PI * 2)*Math.pow(2, this.zoom) | 0;
	//let y = (1-Math.log(Math.tan(this.lat_rad) + 1/Math.cos(this.lat_rad))/Math.PI)/2 *Math.pow(2,this.zoom) | 0;
	// https://a.tile.openstreetmap.org/13/5984/2591.png
	// https://a.tile.openstreetmap.org/13/5984/2591.png
	// https://a.tile.openstreetmap.org/13/5984/2591.png
	//let url = 'https://a.tile.openstreetmap.org/'+this.zoom+'/'+x+'/'+y+'.png';//s:'a-c'
	//		   https://c.tile.openstreetmap.org/17/95761/41460.png
	//alert(url);
	
	/*/ Пример из интернета как объеденить изображения. на канвасе.
	var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var imageObj1 = new Image();
var imageObj2 = new Image();
imageObj1.src = "1.png"
imageObj1.onload = function() {
   ctx.drawImage(imageObj1, 0, 0, 328, 526);
   imageObj2.src = "2.png";
   imageObj2.onload = function() {
      ctx.drawImage(imageObj2, 15, 85, 300, 300);
      var img = c.toDataURL("image/png");
      document.write('<img src="' + img + '" width="328" height="526"/>');
   }
};
//*/
}




