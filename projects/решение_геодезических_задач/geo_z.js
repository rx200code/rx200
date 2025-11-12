/// Гео данные
var geode = {
	krasovsky:{a:6378245,b:6356863.018773047,_a:0.003352329869259135,f:298.3,year:1942},
	grs_80:{a:6378137,b:6356752.314140356,_a:0.003352810681182319,f:298.257222101,year:1980},
	wgs_84:{a:6378137,b:6356752.314245179,_a:0.0033528106647474805,f:298.257223563,year:1984},// у параметра _a под вопросом, верныли данные.
	pz_90_11:{a:6378136,b:6356751.361795686,_a:0.0033528037351842955,f:298.25784,year:1990},
	iers:{a:6378136.49,b:6356751.750491433,_a:0.003352819360654229,f:298.25645,year:1996},
	gsk_2011:{a:6378136.5,b:6356751.757955603,_a:0.003352819752979053,f:298.2564151,year:2011}
};
let ell = {
	wgs_84:{a:6378137,_f:298.257223563},// EPSG:7030
	k_1940:{a:6378245,_f:298.3},// EPSG:7024 Krassowsky_1940
};
for(let key in ell){
	let el = ell[key];
	el.f = 1 / el._f;
	el.b = el.a - el.a * el.f;
	el.e_2 = 2 * el.f - el.f ** 2;
	el.e = el.e_2 ** .5;
	el.e_4 = el.e ** 4;
	el.e_6 = el.e ** 6;
	el.e_8 = el.e ** 6;
	el._e_2 = el.e_2 / (1 - el.e_2);
}
// Вспомогательные функции.
let toRad = deg => deg * Math.PI / 180;
let toDeg = rad => rad / Math.PI * 180;


// Первая простая функция из интернета https://www.kobzarev.com/programming/calculation-of-distances-between-cities-on-their-coordinates/
let calculateDistance = (c1, c2) => {
	const EARTH_RADIUS = 6372795;
	
	let lat1 = toRad(c1[1]);
	let lat2 = toRad(c2[1]);
	let long1 = toRad(c1[0]);
	let long2 = toRad(c2[0]);
	
	let cl1 = Math.cos(lat1);
	let cl2 = Math.cos(lat2);
	let sl1 = Math.sin(lat1);
	let sl2 = Math.sin(lat2);
	let delta = long2 - long1;
	let cdelta = Math.cos(delta);
	let sdelta = Math.sin(delta);
	
	let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
	let x = sl1 * sl2 + cl1 * cl2 * cdelta;
	
	let ad = Math.atan2(y, x);
	//let dist = Math.ceil(ad * EARTH_RADIUS);
	let dist = ad * EARTH_RADIUS;
	return dist;
};

// Tests
//let alfa = toRad(30);
//alert((Math.sin(alfa) ** 2)+"\n"+((1 - Math.cos(2 * alfa)) / 2));



// Вторая сложная функция из книги Морозова, стр. 135
let f_geo_z_1 = (c1, c2) => {
	let B_1 = toRad(c1[1]);
	let B_2 = toRad(c2[1]);
	let L_1 = toRad(c1[0]);
	let L_2 = toRad(c2[0]);
	//
	let e_2 = ell.k_1940.e_2;
	let a = ell.k_1940.a;
	// Подготовительные переменные.
	let W_1 = (1 - e_2 * Math.sin(B_1) ** 2) ** .5;
	let W_2 = (1 - e_2 * Math.sin(B_2) ** 2) ** .5;
	let sin_u_1 = (Math.sin(B_1) * Math.sqrt(1 - e_2)) / W_1;
	let sin_u_2 = (Math.sin(B_2) * Math.sqrt(1 - e_2)) / W_2;
	let cos_u_1 = Math.cos(B_1) / W_1;
	let cos_u_2 = Math.cos(B_2) / W_2;
	let l = L_2 - L_1;
	let a_1 = sin_u_1 * sin_u_2;
	let a_2 = cos_u_1 * cos_u_2;
	let b_1 = cos_u_1 * sin_u_2;
	let b_2 = sin_u_1 * cos_u_2;
	// доп. Гауса.
	let R = [.0856622462, .1803807865, .2339569673, .2339569673, .1803807865, .0856622462];
	let ip = [.0337652429, .1693953068, .380690407, .619309593, .8306046932, .9662347571];
	// А
	let de = 0;
	let cos_2_u_i = [];
	let si, la;
	for(let i = 0; i < 5; i++){
		la = l + de;
		let p = cos_u_2 * Math.sin(la);
		let q = b_1 - b_2 * Math.cos(la);
		//let A_1 = Math.atan2(p, q);
		let A_1 = Math.atan(p / q);
		A_1 = Math.abs(A_1);
		if(p < 0){
			if(q < 0)A_1 = Math.PI + A_1;
			else A_1 = Math.PI * 2 - A_1;
		}else if(q < 0)A_1 = Math.PI - A_1;
		// Б
		let sin_si = p * Math.sin(A_1) + q * Math.cos(A_1);
		let cos_si = a_1 + a_2 * Math.cos(la);
		//si = Math.atan2(sin_si, cos_si);
		si = Math.atan(sin_si / cos_si);
		si = Math.abs(si);
		if(cos_si < 0)si = Math.PI - si;
		// В
		let E_la = 0;
		for(let j = 0; j < 6; j++){
			let ip_i_si = ip[j] * si;
			cos_2_u_i[j] = 1 - (sin_u_1 * Math.cos(ip_i_si) + cos_u_1 * Math.cos(A_1) * Math.sin(ip_i_si)) ** 2;
			E_la += R[j] / (1 + Math.sqrt(1 - e_2 * cos_2_u_i[j]));
		}
		de = e_2 * si * cos_u_1 * Math.sin(A_1) * E_la;
	}
	let E_si = 0;
	for(let j = 0; j < 6; j++)E_si += R[j] * Math.sqrt(1 - e_2 * cos_2_u_i[j]);
	return a * si * E_si;// s
	//let A_2 = Math.atan((cos_u_1 * Math.sin(la)) / (b_1 * Math.cos(la) - b_2));
};

//
let f_geo = () => {
	let text = "";
	// начальные точки. WGS 84 deg
	let c1 = [0, 45];
	let c2 = [c1[0] - (173 + 23 / 60 + 6.8711 / 3600), (45 + 12 / 60 + 54.268 / 3600) * -1];
	//82.736581%2C54.967437~0.331650%2C0.092332
	//-45.193388%2C0.952151
	//let c1 = [82.736581, 54.967437];
	//let c2 = [82.736581 - 45.193388, 54.967437 + 0.952151];
	
	text += "начальные точки. WGS 84 deg: "+c1+" и "+c2+"<br>";
	text += "Первая простая функция из интернета https://www.kobzarev.com/programming/calculation-of-distances-between-cities-on-their-coordinates/<br>";
	let d_1 = calculateDistance(c1, c2);
	text += "<b>"+(d_1 / 1000)+"</b> km.<br>";
	text += "Вторая сложная функция из книги Морозова, стр. 135<br>";
	let d_2 = f_geo_z_1(c1, c2);
	/*
	let time = performance.now();
	for(i = 0; i < 1000000; i++){
		//let arr = [[Math.random() * 360 - 180, Math.random() * 180 - 90], [Math.random() * 360 - 180, Math.random() * 180 - 90]];
		d_2 = f_geo_z_1([Math.random() * 360 - 180, Math.random() * 180 - 90], [Math.random() * 360 - 180, Math.random() * 180 - 90]);
	}
	time = performance.now() - time;
	//*/
	text += "<b>"+(d_2 / 1000)+"</b> km.<br>";
	
	//text += "V = "+time;
	
	
	
	for(let i = 0; i < 361; i++){
		let a_r = toRad(i);
		
		let p = Math.sin(a_r);
		let q = Math.cos(a_r);
		
		let a_1 = Math.atan(p / q);
		a_1 = Math.abs(a_1);
		if(p < 0){
			if(q < 0)a_1 = Math.PI + a_1;
			else a_1 = Math.PI * 2 - a_1;
		}else if(q < 0)a_1 = Math.PI - a_1;
		
		let a_2 = Math.atan2(p, q);
		if(a_2 < 0)a_2 += Math.PI * 2;
		
		text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>"+i+"</b><br>"+toDeg(a_1)+"<br>"+toDeg(a_2);
	}
	
	
	
	
	
	
	out(text);
	//info(text);
};
function out(text){
	document.getElementById("output").innerHTML=text;
}
function info(text){
	document.getElementById("info").innerHTML=text;
}