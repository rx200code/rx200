//JSON.stringify(
function f_hod2(xc,yc,r){//Функция ходов прототип готова.
	var i = 0;
	var i_id = 0;
	var arr_ids = [];
	arr_ids[arr_ids.length] = {id:get_id(xc, yc),hod:0};
	//go_mir.child_sector[get_id(xc, yc)].graf.setAttributeNS(null, "fill", "#888");
	i++;
	while(i <= r){
		//f_1(xc,yc,i);
		i_id = get_id(xc+i, yc);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i};
		i_id = get_id(xc-i, yc);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i};
		i_id = get_id(xc, yc+i);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i};
		i_id = get_id(xc, yc-i);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i};
		
		i++;
	}
	
	var k = 1;
	i = k;
	r -= 1.5;
	while(r >= 0){
		//f_2(xc,yc,i,k);// i, k, Всегда равны.
		i_id = get_id(xc+i, yc+k);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i*1.5};
		i_id = get_id(xc+i, yc-k);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i*1.5};
		i_id = get_id(xc-i, yc+k);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i*1.5};
		i_id = get_id(xc-i, yc-k);
		if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:i*1.5};
		
		i = 1;
		while(r >=i){
			//f_2(xc,yc,i+k,k);
			i_id = get_id(xc+(i+k), yc+k);
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc+(i+k), yc-k);
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc-(i+k), yc+k);
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc-(i+k), yc-k);
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			//f_2(xc,yc,k,i+k);
			i_id = get_id(xc+k, yc+(i+k));
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc+k, yc-(i+k));
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc-k, yc+(i+k));
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i_id = get_id(xc-k, yc-(i+k));
			if(i_id !== -1)arr_ids[arr_ids.length] = {id:i_id,hod:k*1.5+i};
			i++;
		}
		r -= 1.5;
		k++;
		i = k;
	}
	return arr_ids;
	//временно.
	/*
	arr_ids.forEach(function(item){
		var text  = document.createElementNS(svgns, "text");
		//text.setAttribute('x', '10');
		text.setAttributeNS(null,'x', go_mir.child_sector[item.id].x*gi_rs);//+gi_rs/2);
		text.setAttributeNS(null,'y', go_mir.child_sector[item.id].y*gi_rs+gi_rs);///2);
		text.setAttributeNS(null,'font-size', gi_rs/2);
		text.setAttributeNS(null,'fill', '#fff');
		text.textContent = item.hod;
		svg.appendChild(text);
		//go_mir.child_sector[item.id].graf.appendChild(text);
		go_mir.child_sector[item.id].graf.setAttributeNS(null, "fill", "#000");
	});
	info(arr_ids.length);//*/
}
function f_2(xc,yc,x,y){
	go_mir.child_sector[get_id(xc+x, yc+y)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc+x, yc-y)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc-x, yc+y)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc-x, yc-y)].graf.setAttributeNS(null, "fill", "#000");
}
function f_1(xc,yc,r){
	go_mir.child_sector[get_id(xc+r, yc)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc-r, yc)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc, yc+r)].graf.setAttributeNS(null, "fill", "#000");
	go_mir.child_sector[get_id(xc, yc-r)].graf.setAttributeNS(null, "fill", "#000");
}
function f_circle3(xc,yc,r){
	var d = 0;//-xxx/2;//3*2-2*r;
	var x = 0;
	var y = r;
	while(x <= y){
		go_mir.child_sector[get_id(x+xc, y+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(x+xc, -y+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(-x+xc, -y+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(-x+xc, y+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(y+xc, x+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(y+xc, -x+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(-y+xc, -x+yc)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(-y+xc, x+yc)].graf.setAttributeNS(null, "fill", "#000");
		if(d<0){
			d=d+4*x+6;
		}else{
			d=d+4*(x-y)+10;
			y--;
		}
		
		x++;
	}
	
}
function f_circle2(x0,y0,radius) {
	var x = 0;
	var y = radius;
	var delta = 1 - 2 * radius;
	var error = 0;
	while(y >= 0) {
		go_mir.child_sector[get_id(x0 + x, y0 + y)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(x0 + x, y0 - y)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(x0 - x, y0 + y)].graf.setAttributeNS(null, "fill", "#000");
		go_mir.child_sector[get_id(x0 - x, y0 - y)].graf.setAttributeNS(null, "fill", "#000");
		error = 2 * (delta + y) - 1;
		if(delta < 0 && error <= 0) {
			++x;
			delta += 2 * x + 1;
			continue;
		}
		error = 2 * (delta - x) - 1;
		if(delta > 0 && error > 0) {
			--y;
			delta += 1 - 2 * y;
			continue;
		}
		++x;
		delta += 2 * (x - y);
		--y;
	}
}
function test2(){
	var svgns = "http://www.w3.org/2000/svg";
var shape = document.createElementNS(svgns, "circle");
var ra = 15;
shape.setAttributeNS(null, "cx", ra);
shape.setAttributeNS(null, "cy", ra);
shape.setAttributeNS(null, "r",  ra);
shape.setAttributeNS(null, "fill", "green");
svg.appendChild(shape);
	
}
function launchFullScreen(element){
	if(element.requestFullScreen){
		element.requestFullScreen();
	}else if(element.mozRequestFullScreen){
		element.mozRequestFullScreen();
	}else if(element.webkitRequestFullScreen){
		element.webkitRequestFullScreen();
	}
}