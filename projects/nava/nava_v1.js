var nava = {
	Map: class {
		// CONSTS
		rad_90 = Math.PI / 2;
		rad_1 = Math.PI / 180;
		min_zoom = 0;
		max_zoom = 18;
		size_tile = 256;
		zoom_pixels = [this.size_tile];
		zoom_tiles = [1];
		
		
		
		//
		zoom = 14;
		lat = 55;
		lon = 83;
		
		center_y = 41457.793801346335;
		center_x = 95755.37777777779;
		
		
		getXwm(){
			return this.zoom_pixels[this.zoom] * (this.lon / 180 + 1);
		}
		getYwm(){
			
			
		}
		
		
		
		
		a = 0;
		a_top = 0;
		// Точка вращения, в двух системах координат.
		view_point_rotation_x;
		view_point_rotation_y;
		wm_point_rotation_x;
		wm_point_rotation_y;
		
		//
		view_elm;
		view_elm_width;
		view_elm_height;
		view_elm_center_x;
		view_elm_center_y;
		
		//src = 'https://'+arr_s[count_i % arr_s.length]+'.tile.openstreetmap.org/'+zoom_tile+'/'+img.tile_x+'/'+img.tile_y+'.png';
		constructor(){
			for(let i = 1; i <= this.max_zoom; i++){
				this.zoom_pixels[i] = this.zoom_pixels[i - 1] * 2;
				this.zoom_tiles[i] = this.zoom_tiles[i - 1] * 2;
			}
		}
		
		setViewElm(id_elm){
			
			if(typeof id_elm === "string")this.view_elm = document.getElementById(id_elm);
			else if(id_elm instanceof Node)this.view_elm = id_elm;
			else return alert("ERROR: nava.Map.setViewElm");
			
			
			// Исправляем стили элемента просмотра.
			this.view_elm.style = "";
			
			// определяем размеры.
			//let rect_view_elm = this.view_elm.getBoundingClientRect();
			this.view_elm_width = this.view_elm.clientWidth;
			this.view_elm_height = this.view_elm.clientHeight;
			
			this.view_elm_center_x = this.view_elm_width / 2;
			this.view_elm_center_y = this.view_elm_height / 2;
			
			//
			this.view_point_rotation_x = this.view_elm_center_x;
			this.view_point_rotation_y = this.view_elm_center_y;
			
		}
		
		
		setRadA(a){
			this.a = a;
			if(this.a >= 0){// определяем соответствующие значения относительно верхнего угла дисплея
				if(this.a <= this.rad_90){
					this.a_top = this.a;
					
				}else{
					this.a_top = this.a - this.rad_90;
					
				}
			}else{
				if(this.a >= -this.rad_90){
					this.a_top = this.a + this.rad_90;
					
				}else{
					this.a_top = this.a + Math.PI;
					
				}
			}
			
		}
		
		rotation_map(a, rotation_point_x, rotation_point_y){// Вращение карты относительно точки вращения.
			
			let rotation_point_x
			
			
			this.a = a;
			if(this.a >= 0){// определяем соответствующие значения относительно верхнего угла дисплея
				if(this.a <= this.rad_90){
					this.a_top = this.a;
					
				}else{
					this.a_top = this.a - this.rad_90;
					
				}
			}else{
				if(this.a >= -this.rad_90){
					this.a_top = this.a + this.rad_90;
					
				}else{
					this.a_top = this.a + Math.PI;
					
				}
			}
			
		}
		
		
	},
	
	end: ""
};