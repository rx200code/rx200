function Test(){
	/// Слой ТЕСТОВ
	let test_out = document.getElementById("test_out");
	let test_out_2 = document.getElementById("test_out_2");
	let test_out_3 = document.getElementById("test_out_3");
	let test_out_4 = document.getElementById("test_out_4");
	let on_off_test = document.getElementById("on_off_test");
	on_off_test.checked = false;
	
	
	// Вспомогательные #############
	//alert(ol.proj.);
	function listAllProperties(o){     
		let objectToInspect;     
		let result = [];
		
		for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
			result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
		}
		return result; 
	}
	//##############################
	
	
	
	
	
	
	
	
	let options = {};
	options.code = 'EPSG:4322';
	options.units = 0.0174532925199433;
	//options.extent = [];
	//options.axisOrientation = ;
	options.global = true;
	//options.metersPerUnit = 0.0174532925199433;
	//options.worldExtent = [];
	//options.getPointResolution = function(cor){return cor;};
	/*
	let firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
	let secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
	alert(proj4(firstProjection,secondProjection,[2,5]));
	//*/
	//*
	/*
	пример UTM зоны 32 Коды EPSG:32732 и EPSG:32632
	Север
	'+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'
	Юг
	'+proj=utm +zone=32 +south +datum=WGS84 +units=m +no_defs'
	
	//*/
	/*
	пример Pulkovo 1942 / Gauss-Kruger zone 3 EPSG:28403
	'+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs'
	'+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs'// zone 30
	
	//*/
	
	
	
	//let proj_web_mercator = 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]));';
	let proj_web_mercator = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
	//let proj_wgs_84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
	let proj_wgs_84 = '+proj=longlat +datum=WGS84 +no_defs';
	//let proj_wgs_84 = '+proj=longlat +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +no_defs';// wgs72
	//let proj_wgs_84 = '+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs ';//Gauss-Kruger zone 6
	//let proj_coor = [9239521.216468683, 7361864.14443375];
	//alert(proj4(proj_web_mercator, proj_wgs_84, proj_coor));
	//*/
	//*
	ol.proj.addProjection(new ol.proj.Projection(options));
	
	let f_forward = function(cor){
		let lon = cor[0] + 2;
		let lat = cor[1] + 2;
		return [lon, lat];
	};
	let f_inverse = function(cor){
		let lon = cor[0] - 2;
		let lat = cor[1] - 2;
		return [lon, lat];
	};
	
	ol.proj.addCoordinateTransforms('EPSG:3857', 'EPSG:4322', f_forward, f_inverse);
	//*/
	
	function xxxy_to_lf(arr){// Примерно на 33% быстрее чем в OpenLayers ol.proj.toLonLat(arr); Включая общие операции при тестирование, реально ещё быстрее.
		return [(arr[0]/6378137) / Math.PI * 180, (Math.PI / 2 - 2 * Math.atan(Math.pow(Math.E, -arr[1] / 6378137))) / Math.PI * 180];
	}
	function xy_to_lf(arr){// Примерно на 20% быстрее чем в OpenLayers ol.proj.toLonLat(arr);
		let y = (arr[0]/6378137) / Math.PI * 180;
		y %= 360;
		if(y < 0)y += 360;
		return [y, (Math.PI / 2 - 2 * Math.atan(Math.pow(Math.E, -arr[1] / 6378137))) / Math.PI * 180];
	}
	
	function tile2long(x,z) {
		//return (x/6378137) / Math.PI * 180;
		return (Math.PI / 2 - 2 * Math.atan(Math.pow(Math.E, -x / 6378137))) / Math.PI * 180;
	}
	let eef_test = function(e){
		let text = "";
		let c_wgs_84 = proj4('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', '+proj=longlat +datum=WGS84 +no_defs', e.coordinate);
		c_wgs_84[0] %= 360;
		if(c_wgs_84[0] < 0)c_wgs_84[0] += 360;
		text += "Координаты:"+c_wgs_84+"<br>";
		let z = ((6 + c_wgs_84[0]) / 6) | 0;
		
		
		text += "Зона:"+z+"<br>";
		text += "N/S:"+(c_wgs_84[1] < 0 ? "S": "N")+"<br>";
		test_out.innerHTML = text;
	};
	let yyf_test = function(e){
		let i_2 = 1000000;
		let i_3 = 1;
		let text = "";
		let time = 0;
		
		//*
		text += "Координаты My:<br>";
		let sum_my = 0;
		time = performance.now();
		for(let i = 0; i < i_2; i += i_3)sum_my += xy_to_lf([e.coordinate[0], e.coordinate[1] + i])[1];
		time = performance.now() - time;
		text += "sum = "+sum_my+"<br>time = <b>"+time+"</b><br><br>";
		
		let p = time;
		
		text += "Координаты OpenLayers:<br>";
		let sum_ol = 0;
		time = performance.now();
		for(let i = 0; i < i_2; i += i_3)sum_ol += ol.proj.toLonLat([e.coordinate[0], e.coordinate[1] + i])[1];
		time = performance.now() - time;
		text += "sum = "+sum_ol+"<br>time = <b>"+time+"</b><br><br>";
		
		text += "p = <b>"+(100 - (100 / time * p))+"%</b><br><br>";
		
		//*/
		
		
		//*
		//let F_max = 2 * Math.atan(Math.pow(Math.E, Math.PI)) - Math.PI / 2;
		let fff = 0.77;
		//alert((Math.log(Math.tan(fff / 2 + Math.PI / 4)) * 6378137)+"\n"+(Math.asinh(Math.tan(fff)) * 6378137));// примерно одинаковы по скорости, но с лог не работает с отрицательными числами. и с асинаш не стандартезирована.
		// самый быстрый вариант заменить Math.asinh(x) на Math.log(x + Math.sqrt(x * x + 1))
		
		text += "f1<br>";
		let sum_f1 = 0;
		time = performance.now();
		for(let i = 0; i < 1; i += .000001)sum_f1 += Math.log(Math.tan(i / 2 + Math.PI / 4)) * 6378137;
		time = performance.now() - time;
		text += "sum = "+sum_f1+"<br>time = <b>"+time+"</b><br><br>";
		
		text += "f3:<br>";
		let sum_f3 = 0;
		time = performance.now();
		for(let i = 0; i < 1; i += .000001){
			//let x = Math.tan(i);
			sum_f3 += Math.log(Math.tan(i) + Math.sqrt(Math.tan(i) * Math.tan(i) + 1)) * 6378137;
			//sum_f3 += Math.asinh(Math.tan(i)) * 6378137;
		}
		time = performance.now() - time;
		text += "sum = "+sum_f3+"<br>time = <b>"+time+"</b><br><br>";
		
		text += "f2:<br>";
		let sum_f2 = 0;
		time = performance.now();
		for(let i = 0; i < 1; i += .000001){
			let x = Math.tan(i);
			sum_f2 += Math.log(x + Math.sqrt(x * x + 1)) * 6378137;
			//sum_f2 += Math.asinh(Math.tan(i)) * 6378137;
		}
		time = performance.now() - time;
		text += "sum = "+sum_f2+"<br>time = <b>"+time+"</b><br><br>";
		//*/
		
		
		
		
		
		test_out.innerHTML = text;
	};
	
	
	
	
	let xxf_test = function(e){
		let text = "";
		text += "Координаты OpenLayers:<br>X = "+e.coordinate[0]+"<br>Y = "+e.coordinate[1]+"<br>";
		let coord_wgs_84_ol = ol.proj.toLonLat(e.coordinate);
		text += "Координаты WGS 84 OL:<br>Lon(L) = "+coord_wgs_84_ol[0]+"<br>Lat(F) = "+coord_wgs_84_ol[1]+"<br>";
		let coord_wgs_84_my = xy_to_lf(e.coordinate);
		text += "Координаты WGS 84 My:<br>Lon(L) = "+coord_wgs_84_my[0]+"<br>Lat(F) = "+coord_wgs_84_my[1]+"<br>";
		
		
		
		test_out.innerHTML = text;
	};
	
	
	
	
	
	let xxxxf_test = function(e){
		let text = "";
		text += "Координаты OpenLayers:<br>X = "+e.coordinate[0]+"<br>Y = "+e.coordinate[1]+"<br>";
		let coord_wgs_84 = ol.proj.toLonLat(e.coordinate);
		let _e_2 = 1 / Math.pow((1 - 1 / 298.257223563), 2) - 1;
		let B = Math.atan((1 + _e_2) * Math.tan(coord_wgs_84[1] * Math.PI / 180)) / Math.PI * 180;// переводем геоцентрическую(Fi) широту в геодезическую(B)
		text += "Координаты WGS 84:<br>Lon(L) = "+coord_wgs_84[0]+"<br>Lat(F) = "+coord_wgs_84[1]+"<br>Lat(B) = "+B+"<br>";
		/*
		let coord_wgs_84_2 = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4322');
		//alert(ol.proj.get('EPSG:3857'));
		text += "Координаты WGS 84:<br>Lon(L) = "+coord_wgs_84_2[0]+"<br>Lat(F) = "+coord_wgs_84_2[1]+"<br>";
		//alert(ol.proj.toLonLat(e.coordinate));
		let coord_wgs_84_3 = proj4(proj_web_mercator, proj_wgs_84, e.coordinate);
		text += "<b>proj4</b><br>Lon(L) = "+coord_wgs_84_3[0]+"<br>Lat(F) = "+coord_wgs_84_3[1]+"<br>";
		//*/
		
		text += "<br><b>x = "+tile2long(e.coordinate[1], map.view.getZoom())+"</b><br>";;
		let my_lf = xy_to_lf(e.coordinate, map.view.getZoom());
		text += "Координаты my_lf WGS 84:<br>zoom = "+map.view.getZoom()+"<br>Lon(L) = "+my_lf[0]+"<br>Lat(F) = "+my_lf[1]+"<br>";
		
		/*
		for(let key in e.map){
			text += "<br><b>"+key+"</b> = "+e.map[key]+"<br>";
		};
		//*/
		
		test_out.innerHTML = text;
	};
	
	let svg = document.getElementById("svg");
	
	let test_point_2 = createElementNS("path");
	test_point_2.setAttributeNS(null, "fill", "none");
	test_point_2.setAttributeNS(null, "stroke", "#0f0");
	test_point_2.setAttributeNS(null, "stroke-width", 5);
	test_point_2.setAttributeNS(null, "stroke-opacity", .7);
	test_point_2.setAttributeNS(null, "stroke-linecap", "round");
	test_point_2.setAttributeNS(null, "pointer-events", "none");
	svg.appendChild(test_point_2);
	let counter_2 = 0;
	let f_test_2 = function(e){
		let text = "<b>2</b><br>";
		counter_2++;
		text += "counter = "+counter_2+"<br>";
		let coor_center = map.map.getCoordinateFromPixel([width_map / 2,height_map / 2]);
		text += "Координаты OpenLayers:<br>X = "+coor_center[0]+"<br>Y = "+coor_center[1]+"<br>";
		let coord_wgs_84 = ol.proj.toLonLat(coor_center);
		text += "Координаты WGS 84:<br>Lon(L) = "+coord_wgs_84[0]+"<br>Lat(F) = "+coord_wgs_84[1]+"<br>";
		test_out_2.innerHTML = text;
		
		let coor_point = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([coord_wgs_84[0], coord_wgs_84[1]]));
		test_point_2.setAttributeNS(null, "d", "M"+coor_point[0]+","+coor_point[1]+"h0");
	};
	//map.map.on("postrender", f_test_2);
	
	let test_point_3 = createElementNS("path");
	test_point_3.setAttributeNS(null, "fill", "none");
	test_point_3.setAttributeNS(null, "stroke", "#f00");
	test_point_3.setAttributeNS(null, "stroke-width", 5);
	test_point_3.setAttributeNS(null, "stroke-opacity", .7);
	test_point_3.setAttributeNS(null, "stroke-linecap", "round");
	test_point_3.setAttributeNS(null, "pointer-events", "none");
	svg.appendChild(test_point_3);
	let counter_3 = 0;
	
	let coord_wgs_84_point = [0,0];
	let f_test_3 = function(e){
		let text = "<b>3</b><br>";
		counter_3++;
		text += "counter = "+counter_3+"<br>";
		let coor_center = map.map.getCoordinateFromPixel([width_map / 2,height_map / 2]);
		
		text += "Координаты OpenLayers:<br>X = "+coor_center[0]+"<br>Y = "+coor_center[1]+"<br>";
		let coor_center_2 = map.view.getCenter();
		text += "Координаты OpenLayers:<br>X = "+coor_center_2[0]+"<br>Y = "+coor_center_2[1]+"<br>";
		
		let coord_wgs_84 = ol.proj.toLonLat(coor_center);
		text += "Координаты WGS 84:<br>Lon(L) = "+coord_wgs_84[0]+"<br>Lat(F) = "+coord_wgs_84[1]+"<br>";
		test_out_3.innerHTML = text;
		coord_wgs_84_point = coord_wgs_84;
	};
	//map.view.on('change:center', f_test_3);
	//map.map.on("moveend", f_test_3);//3
	//map.map.on("movestart", f_test_3);//1
	//map.map.on("pointerdrag", f_test_3);//2
	//map.map.on("postcompose", f_test_3);
	//map.map.on("postrender", f_test_3);
	//map.map.on("rendercomplete", f_test_3);
	
	//*
	let f_test_3_point = function(e){
		let coor_point = map.map.getPixelFromCoordinate(ol.proj.fromLonLat([coord_wgs_84_point[0], coord_wgs_84_point[1]]));
		test_point_3.setAttributeNS(null, "d", "M"+coor_point[0]+","+coor_point[1]+"h0");
	};
	//map.map.on("postrender", f_test_3_point);
	//*/
	
	
	let test_point_centr = createElementNS("path");
	test_point_centr.setAttributeNS(null, "fill", "none");
	test_point_centr.setAttributeNS(null, "stroke", "#000");
	test_point_centr.setAttributeNS(null, "stroke-width", 2);
	//test_point_centr.setAttributeNS(null, "stroke-opacity", 1);
	test_point_centr.setAttributeNS(null, "stroke-linecap", "round");
	test_point_centr.setAttributeNS(null, "pointer-events", "none");
	test_point_centr.setAttributeNS(null, "d", "M"+(width_map / 2)+","+(height_map / 2)+"h0");
	//svg.appendChild(test_point_centr);
	
	//alert(1 / Math.pow((1 - 1 / 298.257223563), 2) - 1);
	//alert((Math.pow(6378137, 2) - Math.pow(6356752.314, 2)) / Math.pow(6356752.314, 2));
	
	//############## Тест коллекция координат по клику мыши, которая в итоге перейдет в финальный код ##############
	function to_UTM(c){
		let c_wgs_84 = to_wgs_84_deg(c);
		let z = ((6 + c_wgs_84[0]) / 6) | 0;
		z += 30;
		if(z > 60)z -= 60;
		let s = c_wgs_84[1] < 0;
		let arr = [0, 0];
		arr.push((s ? "z:"+z+" S": "z:"+z+" N"));
	return arr;
	}
	function to_UTM_test(){
		//let d = {a:6378137,f:298.257223563};
		let d = {a:6377397.155,f:299.15281};///
		d._f = 1 / d.f;
		d.b = d.a * (1 - d._f);
		d.e = (2 * d._f - d._f ** 2) ** .5;
		let e_2 = d.e ** 2;
		let e_4 = d.e ** 4;
		let e_6 = d.e ** 6;
		let e_8 = d.e ** 8;
		//
		let FE = 3900000;
		let FN = 900000;
		//
		let f_1 = toRad(10);
		//let k_0 = Math.cos(f_1) / ((1 - e_2 * Math.sin(f_1) ** 2) ** .5);
		let k_0 = 0.997;
		//
		let f = toRad(-3);;
		let l = toRad(120);;
		let f_0 = toRad(0);///
		let l_0 = toRad(110);///
		//* to A and B
		let E = FE + d.a * k_0 * (l - l_0);
		let N = FN + d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f / 2) * ((1 - d.e * Math.sin(f)) / (1 + d.e * Math.sin(f))) ** (d.e / 2));
		//*/
		/* to C
		let f_f = 0;
		let l_f = 0;
		let E_f = 0;
		let N_f = 0;
		let M = d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f_f / 2) * ((1 - d.e * Math.sin(f_f)) / (1 + d.e * Math.sin(f_f))) ** (d.e / 2));
		let E = E_f + d.a * k_0 * (l - l_f);
		let N = (N_f - M) + d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f / 2) * ((1 - d.e * Math.sin(f)) / (1 + d.e * Math.sin(f))) ** (d.e / 2));
		//*/
		let B = Math.E;///
		let t = B ** ((FN - N) / (d.a * k_0));///
		let X = Math.PI / 2 - 2 * Math.atan(t);///
		let ttf = X + (e_2 / 2 + 5 * e_4 / 24 + e_6 / 12 + 13 * e_8 / 360) * Math.sin(2 * X) +
					(7 * e_4 / 48 + 29 * e_6 / 240 + 811 * e_8 / 11520) * Math.sin(4 * X) +
					(7 * e_6 / 120 + 81 * e_8 / 1120) * Math.sin(6 * X) +
					(4279 * e_8 / 161280) * Math.sin(8 * X);///
		
		let ttl = ((E - FE) / (d.a * k_0)) + l_0;///
		
		//alert(toDeg(ttf)+"\n"+toDeg(ttl));
	}
	to_UTM_test();
	function UTM_to_test(){
		let d = {a:6378137,f:298.257223563};
		d._f = 1 / d.f;
		d.b = d.a * (1 - d._f);
		d.e = (2 * d._f - d._f ** 2) ** .5;
		let e_2 = d.e ** 2;
		let e_4 = d.e ** 4;
		let e_6 = d.e ** 6;
		let e_8 = d.e ** 8;
		//
		let FN = 0;
		let N = 0;
		let FE = 0;
		let E = 0;
		let k0 = 0;
		let k_0 = 0;
		let l_0 = 0;
		// C
		let N_f = 0;
		let E_f = 0;
		let M = 0;
		let l_f = 0;
		//
		let B = Math.E;
		let t = B ** ((FN - N) / (d.a * k0));
		/* to C
		let t = B ** ((N_f - M - N) / (d.a * k0));
		//*/
		let X = Math.PI / 2 - 2 * Math.atan(t);
		let f = X + (e_2 / 2 + 5 * e_4 / 24 + e_6 / 12 + 13 * e_8 / 360) * Math.sin(2 * X) +
					(7 * e_4 / 48 + 29 * e_6 / 240 + 811 * e_8 / 11520) * Math.sin(4 * X) +
					(7 * e_6 / 120 + 81 * e_8 / 1120) * Math.sin(6 * X) +
					(4279 * e_8 / 161280) * Math.sin(8 * X);
		
		let l = ((E - FE) / (d.a * k_0)) + l_0;
		/* to C
		let l = ((E - E_f) / (d.a * k_0)) + l_f;
		//*/
		//alert(B);
	}
	//UTM_to_test();
	function to_Mercator(c){
		// координаты 84
		let c_84 = to_wgs_84_rad(c);
		let l = c_84[0];
		let f = c_84[1];
		// датум 84
		let d = {a:6378137,f:298.257223563};
		d._f = 1 / d.f;
		d.e = (2 * d._f - d._f ** 2) ** .5;
		let e_2 = d.e ** 2;
		let e_4 = d.e ** 4;
		let e_6 = d.e ** 6;
		let e_8 = d.e ** 8;
		// параметры.
		let f_1 = toRad(0);// Смещение паралели. B C
		//let f_1 = c_84[1];
		let k_0 = Math.cos(f_1) / ((1 - e_2 * Math.sin(f_1) ** 2) ** .5);// Масштаб на экваторе. B C
		//
		//* A B
		let l_0 = 0;
		let FN = 0;
		let FE = 0;
		let E = FE + d.a * k_0 * (l - l_0);
		let N = FN + d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f / 2) * ((1 - d.e * Math.sin(f)) / (1 + d.e * Math.sin(f))) ** (d.e / 2));
		//*/
		/* to C
		let f_f = 0;
		let l_f = 0;
		let E_f = 0;
		let N_f = 0;
		let M = d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f_f / 2) * ((1 - d.e * Math.sin(f_f)) / (1 + d.e * Math.sin(f_f))) ** (d.e / 2));
		let E = E_f + d.a * k_0 * (l - l_f);
		let N = (N_f - M) + d.a * k_0 * Math.log(Math.tan(Math.PI / 4 + f / 2) * ((1 - d.e * Math.sin(f)) / (1 + d.e * Math.sin(f))) ** (d.e / 2));
		//*/
		
		
		return [E, N];
	}
	
	
	function deg_wgs84_to_Cassini_Soldner(c){
		// датум 84
		let d = {a:6378137,f:298.257223563};
		//let d = {a:31706587.88,f:294.2606764};
		d._f = 1 / d.f;
		d.e = (2 * d._f - d._f ** 2) ** .5;
		let e_2 = d.e ** 2;
		let e_4 = d.e ** 4;
		let e_6 = d.e ** 6;
		let a = d.a;
		//
		let l = toRad(c[0]);
		let f = toRad(c[1]);
		//let l = -toRad(62);
		//let f = toRad(10);
		
		//
		let f_0 = toRad(55);// Сюда вводить центер сетки, иначе большие искажения.
		let l_0 = toRad(83);// Сюда вводить центер сетки, иначе большие искажения.
		//let f_0 = toRad(c[1]);
		//let l_0 = toRad(c[0]);
		//let f_0 = 0.182241463;
		//let l_0 = -1.070468608;
		
		let M_0 = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f_0 - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f_0) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f_0) - (35 * e_6 / 3072) * Math.sin(6 * f_0));
		let M = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f) - (35 * e_6 / 3072) * Math.sin(6 * f));
		
		
		let v = a / (1 - e_2 * Math.sin(f) ** 2) ** .5;
		let C = e_2 * Math.cos(f) ** 2 / (1 - e_2);
		let T = Math.tan(f) ** 2;
		let A = (l - l_0) * Math.cos(f);
		let X = M - M_0 + v * Math.tan(f) * (A ** 2 / 2 + (5 - T + 6 * C) * A ** 4 / 24);
		
		let FE = 0;
		let FN = 0;
		//let FE = 430000;
		//let FN = 325000;
		
		let E = FE + v * (A - T * A ** 3 / 6 - (8 - T + 8 * C) * T * A ** 5 / 120);
		let N = FN + X;
		
		/*
		alert(
			"A "+A+"\n"+
			"T "+T+"\n"+
			"v "+v+"\n"+
			"C "+C+"\n"+
			"M "+M+"\n"+
			"M_0 "+M_0+"\n"+
			"E "+E+"\n"+
			"N "+N
		);//*/
		return [E, N];
	}
	
	function xx_to_UTM_JHS(c){
		// датум 84
		let a = 6378137;
		///let a = 6377563.369;
		let _f = 298.257223563;
		///let _f = 299.32496;
		let df = 1 / _f;
		let e = (2 * df - df ** 2) ** .5;
		let e_2 = e ** 2;
		// координаты 84
		let c_84 = to_wgs_84_rad(c);
		let l = c_84[0];
		let f = c_84[1];
		///let l = toRad(.5);
		///let f = toRad(50.5);
		///
		let n = df / (2 - df);
		let B = (a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
		let h_1 = n / 2 - (2 / 3) * n ** 2 + (5 / 16) * n ** 3 + (41 / 180) * n ** 4;
		let h_2 = (13 / 48) * n ** 2 - (3 / 5) * n ** 3 + (557 / 1440) * n ** 4;
		let h_3 = (61 / 240) * n ** 3 - (103 / 140) * n ** 4;
		let h_4 = (49561 / 161280) * n ** 4;
		//alert(-10 % 7);
		let f_0 = toRad(0);
		///let f_0 = toRad(49);
		
		
		//let z_0 = ((6 + toDeg(c_84[0])) / 6) | 0;
		let os = 81;
		
		///let l_0 = toRad(os);
		let l_0 = toRad(-2);
		let FE = 500000;
		let FN = 0;
		///let FE = 400000;
		///let FN = -100000;
		let k_0 = .9996;
		///let k_0 = .9996012717;
		let M_0 = 0;
		if(f_0 == 0)M_0 = 0;
		else if(f_0 == Math.PI / 2)M_0 = B * (Math.PI / 2);
		else if(f_0 == -Math.PI / 2)M_0 = B * (-Math.PI / 2);
		else{
			//let Q_0 = Math.asinh(Math.tan(f_0)) - (e * Math.atanh(e * Math.sin(f_0)));
			let x = Math.tan(f_0);
			let x2 = e * Math.sin(f_0);
			let Q_0 = Math.log(x + Math.sqrt(x * x + 1)) - (e * (Math.log((1 + x2) / (1 - x2)) / 2));
			let B_0 = Math.atan(Math.sinh(Q_0));
			let W_00 =  Math.asin(Math.sin(B_0));
			let W_01 = h_1 * Math.sin(2 * W_00);
			let W_02 = h_2 * Math.sin(4 * W_00);
			let W_03 = h_3 * Math.sin(6 * W_00);
			let W_04 = h_4 * Math.sin(8 * W_00);
			let W_0 = W_00 + W_01 + W_02 + W_03 + W_04;
			M_0 = B * W_0;
		};
		/* Альтернативный способ, "Если начало координат сетки проекции очень близко, но не точно на полюсе (в пределах 2 дюймов или 50 м)" расчеты выше для M_0 нестабильны, и лучше использовать расчет их USGS
		M_0 = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f_0 - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f_0) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f_0) - (35 * e_6 / 3072) * Math.sin(6 * f_0));
		//*/
		let Q = Math.asinh(Math.tan(f)) - (e * Math.atanh(e * Math.sin(f)));
		let _B = Math.atan(Math.sinh(Q));
		let n_0 = Math.atanh(Math.cos(_B) * Math.sin(l - l_0));
		let W_0 =  Math.asin(Math.sin(_B) * Math.cosh(n_0));
		
		let W_1 = h_1 * Math.sin(2 * W_0) * Math.cosh(2 * n_0);
		let W_2 = h_2 * Math.sin(4 * W_0) * Math.cosh(4 * n_0);
		let W_3 = h_3 * Math.sin(6 * W_0) * Math.cosh(6 * n_0);
		let W_4 = h_4 * Math.sin(8 * W_0) * Math.cosh(8 * n_0);
		let W = W_0 + W_1 + W_2 + W_3 + W_4;
		
		let n_1 = h_1 * Math.cos(2 * W_0) * Math.sinh(2 * n_0);
		let n_2 = h_2 * Math.cos(4 * W_0) * Math.sinh(4 * n_0);
		let n_3 = h_3 * Math.cos(6 * W_0) * Math.sinh(6 * n_0);
		let n_4 = h_4 * Math.cos(8 * W_0) * Math.sinh(8 * n_0);
		let _n = n_0 + n_1 + n_2 + n_4 + n_4;
		
		let E = FE + k_0 * B * _n;
		let N = FN + k_0 * (B * W - M_0);
		
		let z = 44;
		return [E, N, z];
	}
	function xxto_UTM_USGS(c, t_os = 81){
		// датум 84
		let a = 6378137;
		let _f = 298.257223563;
		let df = 1 / _f;
		let e = (2 * df - df ** 2) ** .5;
		let e_2 = e ** 2;
		let e_4 = e ** 4;
		let e_6 = e ** 6;
		let _e_2 = e_2 / (1 - e_2);
		// координаты 84
		let c_84 = to_wgs_84_rad(c);
		
		
		let l = c_84[0];
		let f = c_84[1];
		///
		let f_0 = toRad(0);
		let os = t_os;
		let l_0 = toRad(os);
		let FE = 500000;
		let FN = 0;
		let k_0 = .9996;
		///
		let T = Math.tan(f) ** 2;
		let C = e_2 * Math.cos(f) ** 2 / (1 - e_2);
		let A = (l - l_0) * Math.cos(f);
		let v = a / (1 - e_2 * Math.sin(f) ** 2) ** .5;
		let M_0 = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f_0 - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f_0) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f_0) - (35 * e_6 / 3072) * Math.sin(6 * f_0));
		let M = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f) - (35 * e_6 / 3072) * Math.sin(6 * f));
		let E = FE + k_0 * v * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * _e_2) * A ** 5 / 120);
		let N = FN + k_0 * (M - M_0 + v * Math.tan(f) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * _e_2) * A ** 6 / 720));
		let z = 44;
		return [E, N, z];
	}
	// Для тестов Гаусса-Крюгера WGS 84
//function f_wgs84_in_gauss_kruger(L_deg, B_deg){
function f_wgs84_in_gauss_kruger(c){
	let c_84 = to_wgs_84_deg(c);
	//* для тестов.
	B_deg = c_84[1];
	L_deg = c_84[0];
	//let a = 6378245;// krasovsky
	//let b = 6356863.0188;// krasovsky 6356863.018773047 */
	//*
	let a = 6378137;// WGS 84
	let b = 6356752.314245179;// WGS 84 */
	let _a = (a - b) / a;// (I.4)
	
	let B = B_deg * Math.PI / 180;// B_deg в радианах.
	
	let e2 = _a * (2 - _a);// e в квадрате или (I.2) в квадрате. в JavaScript точность, у квадрата (e) на один знак больше, получается путем: _a * (2 - _a);
	let N = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(B), 2));// (I.60)
	let e_2 = Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2)) / b;// (I.3)
	let _n = e_2 * Math.cos(B);// (I.28)
	// (VI.21) // имеется ошибка в книге стр. 224 внизу в, b_3 правильно (1 / 6) * N * Math.pow(Math.cos(B), 3) * (1 - Math.pow(Math.tan(B), 2) + Math.pow(_n, 2));
	let a_2 = .5 * N * Math.sin(B) * Math.cos(B);
	let a_4 = (1 / 24) * N * Math.sin(B) * Math.pow(Math.cos(B), 3) * (5 - Math.pow(Math.tan(B), 2) + 9 * Math.pow(_n, 2) + 4 * Math.pow(_n, 4));
	let a_6 = (1 / 720) * N * Math.sin(B) * Math.pow(Math.cos(B), 5) * (61 - 58 * Math.pow(Math.tan(B), 2) + Math.pow(Math.tan(B), 4) + 270 * Math.pow(_n, 2) - 330 * Math.pow(_n, 2) * Math.pow(Math.tan(B), 2));
	let a_8 = (1 / 40320) * N * Math.sin(B) * Math.pow(Math.cos(B), 7) * (1385 - 3111 * Math.pow(Math.tan(B), 2) + 543 * Math.pow(Math.tan(B), 4) - Math.pow(Math.tan(B), 6));
	
	let b_1 = N * Math.cos(B);
	let b_3 = (1 / 6) * N * Math.pow(Math.cos(B), 3) * (1 - Math.pow(Math.tan(B), 2) + Math.pow(_n, 2));
	let b_5 = (1 / 120) * N * Math.pow(Math.cos(B), 5) * (5 - 18 * Math.pow(Math.tan(B), 2) + Math.pow(Math.tan(B), 4) + 14 * Math.pow(_n, 2) - 58 * Math.pow(_n, 2) * Math.pow(Math.tan(B), 2));
	let b_7 = (1 / 5040) * N * Math.pow(Math.cos(B), 7) * (61 - 479 * Math.pow(Math.tan(B), 2) + 179 * Math.pow(Math.tan(B), 4) - Math.pow(Math.tan(B), 6));//alert(Math.pow(Math.tan(B), тут 8 или 6));
	
	/// Доп 1.
	//(I.65)
	let m_0 = a * (1 - e2);
	let m_2 = 3 / 2 * e2 * m_0;
	let m_4 = 5 / 4 * e2 * m_2;
	let m_6 = 7 / 6 * e2 * m_4;
	let m_8 = 9 / 8 * e2 * m_6;
	// стр 22 под (I.67)
	let a0 = m_0 + (m_2 / 2) + ((3 / 8) * m_4) + ((5 / 16) * m_6) + ((35 / 128) * m_8);
	let a2 = (m_2 / 2) + (m_4 / 2) + ((15 / 32) * m_6) + ((7 / 16) * m_8);
	let a4 = (m_4 / 8) + ((3 / 16) * m_6) + ((7 / 32) * m_8);
	let a6 = (m_6 / 32) + (m_8 / 16);
	let a8 = m_8 / 128;
	// (I.98)
	let X = a0 * B - (a2 / 2) * Math.sin(2 * B) + (a4 / 4) * Math.sin(4 * B) - (a6 / 6) * Math.sin(6 * B) + (a8 / 8) * Math.sin(8 * B);
	// Доп 2.
	let _X = 0;
	let z = ((6 + L_deg) / 6) | 0;// зона
	
	let L = z * 6 - 3;// ось
	let L_1 = L_deg - L;
	
	let l = Math.abs(L_1) * Math.PI / 180;// B_deg в радианах.
	
	
	//let l = 9 * Math.PI / 180;;// для тестов.
	// (VI.20)
	let x = X + a_2 * Math.pow(l, 2) + a_4 * Math.pow(l, 4) + a_6 * Math.pow(l, 6) + a_8 * Math.pow(l, 8);
	let y = b_1 * l + b_3 * Math.pow(l, 3) + b_5 * Math.pow(l, 5) + b_7 * Math.pow(l, 7);
	
	let k_0 = .9996;// для тестов.
	let FE = 500000;
	x *= k_0;
	y *= k_0;
	y += FE;
	return [y, x, z];
}
	
	let c_pixel = [0,0];
	let c_coord = [0,0];
	let c_wgs_84_ol = [0,0];
	let c_wgs_84_my = [0,0];
	let c_wgs_84_Proj4js = [0,0];
	let c_UTM_Proj4js = [0,0];
	let c_Mercator_my = [0,0];
	let c_CS_my = [0,0];
	let c_UTM_JHS_my = [0,0];
	let c_UTM_USGS_my = [0,0];
	let c_UTM_Morozov_my = [0,0];
	let c_sk_42_my = [0,0];
	function f_length(g_c,c){
		let l = ((g_c[0] - c[0]) ** 2 + (g_c[1] - c[1]) **2) ** .5;
		g_c[0] = c[0];
		g_c[1] = c[1];
		return l;
	}
	function f_test_speed(c,f){
		return [0, 0];// Отключает тест на время.
		let sum = 0;
		let i = 10000;
		let k = 100000;
		let time = performance.now();
		while(i--)sum += f([c[0] + (i / k), c[1] + (i / k)])[0];
		time = performance.now() - time;
		return [time, sum];
	}
	let f_test = function(e){
		let text = "";
		text += "<b>Начальные</b><br>";
		text += "e.pixel:<br>X = "+e.pixel[0]+"<br>Y = "+e.pixel[1]+"<br>длина = "+f_length(c_pixel, e.pixel)+"<br>";
		text += "Координаты OpenLayers WM(EPSG:3857):<br>X = "+e.coordinate[0]+"<br>Y = "+e.coordinate[1]+"<br>длина = "+f_length(c_coord, e.coordinate)+"<br>";
		text += "<b>перевод в WGS 84(EPSG:4326)</b><br>";
		let coor_wgs_84_ol = ol.proj.toLonLat(e.coordinate);
		text += "Координаты WGS 84 OL:<br>Lon(L) = "+coor_wgs_84_ol[0]+"<br>Lat(F) = "+coor_wgs_84_ol[1]+"<br>длина = "+f_length(c_wgs_84_ol, coor_wgs_84_ol)+"<br>";
		let coor_wgs_84_my = to_wgs_84_deg(e.coordinate);
		text += "Координаты WGS 84 My:<br>Lon(L) = "+coor_wgs_84_my[0]+"<br>Lat(F) = "+coor_wgs_84_my[1]+"<br>длина = "+f_length(c_wgs_84_my, coor_wgs_84_my)+"<br>";
		let coor_wgs_84_Proj4js = to_wgs_84_proj4(e.coordinate);
		text += "Координаты WGS 84 Proj4js:<br>Lon(L) = "+coor_wgs_84_Proj4js[0]+"<br>Lat(F) = "+coor_wgs_84_Proj4js[1]+"<br>длина = "+f_length(c_wgs_84_Proj4js, coor_wgs_84_Proj4js)+"<br>";
		text += "<b>перевод в UTM</b><br>";
		let coor_UTM_Proj4js = to_UTM_proj4(e.coordinate);// В мозиле раз в 100 медленнее аналогов, в хроме в 40 раз, в Новом осле в 40 раз медленнее. В окончательном коде отказаться от Proj4js использовать только для тестов.
		text += "Координаты UTM Proj4js:<br>"+f_test_speed(e.coordinate, to_UTM_proj4)+"<br>x = "+coor_UTM_Proj4js[0]+"<br>y = "+coor_UTM_Proj4js[1]+"<br>z = "+coor_UTM_Proj4js[2]+"<br><b>длина = "+f_length(c_UTM_Proj4js, coor_UTM_Proj4js)+"</b><br>";
		/*
		let coor_Mercator_my = to_Mercator(e.coordinate);
		text += "Координаты Mercator My:<br>x = "+coor_Mercator_my[0]+"<br>y = "+coor_Mercator_my[1]+"<br>длина = "+f_length(c_Mercator_my, coor_Mercator_my)+"<br>";
		let coor_ol_wgs84_to_WM = ol.proj.fromLonLat(ol.proj.toLonLat(e.coordinate));
		text += "Координаты WM ol:<br>x = "+coor_ol_wgs84_to_WM[0]+"<br>y = "+coor_ol_wgs84_to_WM[1]+"<br>";
		let coor_my_wgs84_to_WM = deg_wgs84_to_WM(to_wgs_84_deg(e.coordinate));
		text += "Координаты WM My:<br>x = "+coor_my_wgs84_to_WM[0]+"<br>y = "+coor_my_wgs84_to_WM[1]+"<br>";
		let coor_CS_my = deg_wgs84_to_Cassini_Soldner(to_wgs_84_deg(e.coordinate));
		text += "Координаты Mercator My:<br>x = "+coor_CS_my[0]+"<br>y = "+coor_CS_my[1]+"<br>длина = "+f_length(c_CS_my, coor_CS_my)+"<br>";
		//*/
		let coor_UTM_USGS_my = to_UTM_USGS(e.coordinate, 81);
		text += "Координаты UTM My USGS:<br>"+f_test_speed(e.coordinate, to_UTM_USGS)+"<br>x = "+coor_UTM_USGS_my[0]+"<br>y = "+coor_UTM_USGS_my[1]+"<br>z = "+coor_UTM_USGS_my[2]+"<br><b>длина = "+f_length(c_UTM_USGS_my, coor_UTM_USGS_my)+"</b><br>";
		
		let coor_UTM_USGS_my_2 = to_UTM_USGS(e.coordinate, 81 - 360);
		text += "Координаты UTM My USGS 2:<br>"+f_test_speed(e.coordinate, to_UTM_USGS)+"<br>x = "+coor_UTM_USGS_my_2[0]+"<br>y = "+coor_UTM_USGS_my_2[1]+"<br>z = "+coor_UTM_USGS_my_2[2]+"<br><b>длина = "+f_length(c_UTM_USGS_my, coor_UTM_USGS_my_2)+"</b><br>";
		
		
		let coor_UTM_JHS_my = to_UTM_JHS(e.coordinate);
		text += "Координаты UTM My JHS:<br>"+f_test_speed(e.coordinate, to_UTM_JHS)+"<br>x = "+coor_UTM_JHS_my[0]+"<br>y = "+coor_UTM_JHS_my[1]+"<br>z = "+coor_UTM_JHS_my[2]+"<br>длина = "+f_length(c_UTM_JHS_my, coor_UTM_JHS_my)+"<br>";
		
		let coor_UTM_Morozov_my = f_wgs84_in_gauss_kruger(e.coordinate);
		text += "Координаты UTM My Morozov:<br>"+f_test_speed(e.coordinate, f_wgs84_in_gauss_kruger)+"<br>x = "+coor_UTM_Morozov_my[0]+"<br>y = "+coor_UTM_Morozov_my[1]+"<br>z = "+coor_UTM_Morozov_my[2]+"<br>длина = "+f_length(c_UTM_Morozov_my, coor_UTM_Morozov_my)+"<br>";
		
		let coor_sk_42_my = to_sk_42(e.coordinate).map(toDeg);
		text += "Координаты SK 42 My Morozov:<br>"+f_test_speed(e.coordinate, f_wgs84_in_gauss_kruger)+"<br>E = "+coor_sk_42_my[0]+"<br>N = "+coor_sk_42_my[1]+"<br>длина = "+f_length(c_sk_42_my, coor_sk_42_my)+"<br>";
		
		
		
		
		
		test_out.innerHTML = text;
	};
	//##############################################################################################################
	on_off_test.onchange = function(e){
		if(on_off_test.checked){
			test_out.innerHTML = "Режим тестов включен";
			map.map.on("click", f_test);
		}else{
			test_out.innerHTML = "Режим тестов выключен";
			map.map.un("click", f_test);
		}
	};
	
	
}