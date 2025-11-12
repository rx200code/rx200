/// Гео данные
var geode = {
	krasovsky:{a:6378245,b:6356863.018773047,_a:0.003352329869259135,f:298.3,year:1942},
	grs_80:{a:6378137,b:6356752.314140356,_a:0.003352810681182319,f:298.257222101,year:1980},
	wgs_84:{a:6378137,b:6356752.314245179,_a:0.0033528106647474805,f:298.257223563,year:1984},// у параметра _a под вопросом, верныли данные.
	pz_90_11:{a:6378136,b:6356751.361795686,_a:0.0033528037351842955,f:298.25784,year:1990},
	iers:{a:6378136.49,b:6356751.750491433,_a:0.003352819360654229,f:298.25645,year:1996},
	gsk_2011:{a:6378136.5,b:6356751.757955603,_a:0.003352819752979053,f:298.2564151,year:2011}
};
class Geods{
	constructor(name = "wgs_84"){
		this.base_name = name;
		this.Fi = 55 * Math.PI / 180;
		this.L = 83 * Math.PI / 180;
	}
	static geod = {
		EPSG_32040:{a:6378206.4,f:294.9787},
		EPSG_3110:{a:6378160,f:298.25},
		JAD69:{a:6378206.4,f:294.9787},
		wgs_72:{a:6378135,f:298.26},//EPSG:4322
		wgs_84:{a:6378137,f:298.257223563}//EPSG:4326
	}
	// стр. 6
	get a(){
		return Geods.geod[this.base_name].a;
	}
	get a_US(){
		return Geods.geod[this.base_name].a / 0.3048006096;// геодезический фут(survey foot)
	}
	get b(){
		return Geods.geod[this.base_name].a * (1 - 1 / Geods.geod[this.base_name].f);
	}
	get f(){
		return Geods.geod[this.base_name].f;
	}
	get _f(){
		return 1 / this.f;
	}
	get e(){
		return Math.sqrt(2 * this._f - Math.pow(this._f, 2));
	}
	get e_2(){
		return Math.pow(this.e, 2);
	}
	get _e(){
		return  Math.sqrt(this.e_2 / (1 - this.e));
	}
	get _e_2(){
		return Math.pow(this._e, 2);
	}
	get p(){
		return  this.a * (1 - this.e_2) / Math.pow(1 - this.e_2 * Math.pow(Math.sin(this.Fi), 2), 3 / 2);
	}
	get v(){
		return  this.a / Math.pow(1 - this.e_2 * Math.pow(Math.sin(this.Fi), 2), 1 / 2);
	}
	get Ra(){
		return  this.a * Math.pow((1 - ((1 - this.e_2) / (2 * this.e)) * Math.log((1 - this.e) / (1 + this.e))) * 0.5, 1 / 2);
	}
	get Rc(){
		return  Math.pow(this.p * this.v, 1 / 2);
		//return  this.a * Math.pow(1 - this.e_2, 1 / 2) / (1 - this.e_2 * Math.pow(Math.sin(this.Fi), 2));// другой вариант.
	}
	// стр. 19
	lambert_2SP(Ff, Lf, F1, F2, Ef, Nf, F, L, a = this.a){
		let text = "";
		let m = (F) => Math.cos(F) / Math.pow(1 - this.e_2 * Math.pow(Math.sin(F), 2), 0.5);
		let m1 = m(F1);
		let m2 = m(F2);
		text += "m1 = "+m1+"<br>";
		text += "m2 = "+m2+"<br>";
		let _t = (F) => Math.tan(Math.PI / 4 - F / 2) / Math.pow((1 - this.e * Math.sin(F)) / (1 + this.e * Math.sin(F)), this.e / 2);
		let t = _t(F);
		let tf = _t(Ff);
		let t1 = _t(F1);
		let t2 = _t(F2);
		text += "t = "+t+"<br>";
		text += "tf = "+tf+"<br>";
		text += "t1 = "+t1+"<br>";
		text += "t2 = "+t2+"<br>";
		let n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
		text += "n = "+n+"<br>";
		let f = m1 / (n * Math.pow(t1, n));
		text += "F = "+f+"<br>";
		let _r = (t) => a * f * Math.pow(t, n);
		let r = _r(t);
		let rf = _r(tf);
		text += "r = "+r+"<br>";
		text += "rf = "+rf+"<br>";
		let O = n * (L - Lf);
		text += "O = "+O+"<br>";
		let E = Ef + r * Math.sin(O);
		let N = Nf + rf - r * Math.cos(O);
		text += "E = "+E+"<br>";
		text += "N = "+N+"<br>";
		let cof = 1;
		if(n < 0)cof = -1;
		let O_ = Math.atan2(cof * (E - Ef), cof * (rf - (N - Nf)));
		text += "O' = "+O_+"<br>";
		let r_ = cof * Math.pow(Math.pow(E - Ef, 2) + Math.pow(rf - (N - Nf), 2), 0.5);
		let t_ = Math.pow(r_ / (a * f), 1 / n);
		text += "t' = "+t_+"<br>";
		text += "r' = "+r_+"<br>";
		let F_ = Math.PI / 2 - 2 * Math.atan(t_);
		let i = 4;
		while(i--)F_ = Math.PI / 2 - 2 * Math.atan(t_ * Math.pow((1 - this.e * Math.sin(F_)) / (1 + this.e * Math.sin(F_)), this.e / 2));
		let L_ = O_ / n + Lf;
		text += "F = "+F_+" = ("+rad_in_deg(F_)+"°)<br>";
		text += "L = "+L_+"<br>";
		return text;
	}
	// стр. 21
	lambert_1SP(F0, L0, K0, FE, FN, F, L, a = this.a){
		let text = "";
		let m0 = Math.cos(F0) / Math.pow(1 - this.e_2 * Math.pow(Math.sin(F0), 2), 0.5);
		text += "m0 = "+m0+"<br>";
		let _t = (F) => Math.tan(Math.PI / 4 - F / 2) / Math.pow((1 - this.e * Math.sin(F)) / (1 + this.e * Math.sin(F)), this.e / 2);
		let t = _t(F);
		let t0 = _t(F0);
		text += "t = "+t+"<br>";
		text += "t0 = "+t0+"<br>";
		let n = Math.sin(F0);
		text += "n = "+n+"<br>";
		let f = m0 / (n * Math.pow(t0, n));
		text += "F = "+f+"<br>";
		let _r = (t) => a * f * Math.pow(t, n) * K0;
		let r = _r(t);
		let r0 = _r(t0);
		text += "r = "+r+"<br>";
		text += "r0 = "+r0+"<br>";
		let O = n * (L - L0);
		text += "O = "+O+"<br>";
		let E = FE + r * Math.sin(O);
		let N = FN + r0 - r * Math.cos(O);
		text += "E = "+E+"<br>";
		text += "N = "+N+"<br>";
		let cof = 1;
		if(n < 0)cof = -1;
		let O_ = Math.atan2(cof * (E - FE), cof * (r0 - (N - FN)));
		text += "O' = "+O_+"<br>";
		let r_ = cof * Math.pow(Math.pow(E - FE, 2) + Math.pow(r0 - (N - FN), 2), 0.5);
		let t_ = Math.pow(r_ / (a * K0 * f), 1 / n);
		text += "t' = "+t_+"<br>";
		text += "r' = "+r_+"<br>";
		let F_ = Math.PI / 2 - 2 * Math.atan(t_);
		let i = 4;
		while(i--)F_ = Math.PI / 2 - 2 * Math.atan(t_ * Math.pow((1 - this.e * Math.sin(F_)) / (1 + this.e * Math.sin(F_)), this.e / 2));
		let L_ = O_ / n + L0;
		text += "F = "+F_+" = ("+rad_in_deg(F_)+"°)<br>";
		text += "L = "+L_+"<br>";
		return text;
	}
	// стр. 97
	conversion_in_geocentric(name_system, f, l, h){
		let text = "";
		this.base_name = name_system;
		text += "e² = "+this.e_2+"<br>";
		let z = this.e_2 / (1 - this.e_2);
		text += "z = "+z+"<br>";
		text += "b = "+this.b+"<br>";
		text += "f = "+f+"<br>";
		let v = this.a / Math.pow(1 - this.e_2 * Math.pow(Math.sin(f), 2), 1 / 2);
		text += "v = "+v+"<br>";
		let X = (v + h) * Math.cos(f) * Math.cos(l);
		text += "X = "+X+"<br>";
		let Y = (v + h) * Math.cos(f) * Math.sin(l);
		text += "Y = "+Y+"<br>";
		let Z = ((1 - this.e_2) * v + h) * Math.sin(f);
		text += "Z = "+Z+"<br>";
		text += "Обратное:<br>";
		let p = Math.pow(Math.pow(X, 2) + Math.pow(Y, 2), 0.5);
		text += "p = "+p+"<br>";
		let q = Math.atan2(Z * this.a, p * this.b);
		text += "q = "+q+"<br>";
		let fi_interation = 0;
		let vi = 0;
		let i = 7;
		while(i--){
			vi = this.a / Math.pow(1 - this.e_2 * Math.pow(Math.sin(fi_interation), 2), 1 / 2);
			fi_interation = Math.atan2(Z + this.e_2 * vi * Math.sin(fi_interation), p);
		}
		text += "v = "+vi+"<br>";
		text += "f = "+fi_interation+"<br>";
		let fi = Math.atan2(Z + z * this.b * Math.pow(Math.sin(q), 3), p - this.e_2 * this.a * Math.pow(Math.cos(q), 3));
		text += "f = "+fi+"<br>";
		let li = Math.atan2(Y, X);
		text += "l = "+li+"<br>";
		let hi = X * (1 / Math.cos(li)) * (1 / Math.cos(fi_interation)) - vi;
		text += "h = "+hi+"<br>";
		let hi2 = (p / Math.cos(fi_interation)) - vi;
		text += "h = "+hi2+"<br>";
		return text;
	}
	// стр. 101
	conversion_in_topocentric(name_system, X0, Y0, Z0, X, Y, Z){
		this.base_name = name_system;
		let text = "";
		let z = this.e_2 / (1 - this.e_2);
		text += "z = "+z+"<br>";
		let p = Math.pow(Math.pow(X0, 2) + Math.pow(Y0, 2), 0.5);
		text += "p = "+p+"<br>";
		let q = Math.atan2(Z0 * this.a, p * this.b);
		text += "q = "+q+"<br>";
		let fi = Math.atan2(Z0 + z * this.b * Math.pow(Math.sin(q), 3), p - this.e_2 * this.a * Math.pow(Math.cos(q), 3));
		text += "f = "+fi+"<br>";
		let li = Math.atan2(Y0, X0);
		text += "l = "+li+"<br>";
		let U = -(X - X0) * Math.sin(li) + (Y - Y0) * Math.cos(li);
		text += "U = "+U+"<br>";
		let V = -(X - X0) * Math.sin(fi) * Math.cos(li) - (Y - Y0) * Math.sin(fi) * Math.sin(li) + (Z - Z0) * Math.cos(fi);
		text += "V = "+V+"<br>";
		let W = (X - X0) * Math.cos(fi) * Math.cos(li) + (Y - Y0) * Math.cos(fi) * Math.sin(li) + (Z - Z0) * Math.sin(fi);
		text += "W = "+W+"<br>";
		let _X = X0 - U * Math.sin(li) - V * Math.sin(fi) * Math.cos(li) + W * Math.cos(fi) * Math.cos(li);
		text += "X = "+_X+"<br>";
		let _Y = Y0 + U * Math.cos(li) - V * Math.sin(fi) * Math.sin(li) + W * Math.cos(fi) * Math.sin(li);
		text += "Y = "+_Y+"<br>";
		let _Z = Z0 + V * Math.cos(fi) + W * Math.sin(fi);
		text += "Z = "+_Z+"<br>";
		return text;
	}
	// стр. 110
	helmert7(X, Y, Z, tX, tY, tZ, rX, rY, rZ, M){
		let text = "";
		let Xt = M * (X - rZ * Y + rY * Z) + tX;
		text += "X = "+Xt+"<br>";
		let Yt = M * (rZ * X + Y - rX * Z) + tY;
		text += "Y = "+Yt+"<br>";
		let Zt = M * (-rY * X + rX * Y + Z) + tZ;
		text += "Z = "+Zt+"<br>";
		
		// стр. 111
		let X2 = Xt - tX;
		let Y2 = Yt - tY;
		let Z2 = Zt - tZ;
		let M2 = (1 / M);
		
		let Xs = M2 * (X2 + rZ * Y2 - rY * Z2);
		text += "Xs = "+Xs+"<br>";
		let Ys = M2 * (-rZ * X2 + Y2 + rX * Z2);
		text += "Ys = "+Ys+"<br>";
		let Zs = M2 * (rY * X2 - rX * Y2 + Z2);
		text += "Zs = "+Zs+"<br>";
		
		return text;
	}
	// стр. 110
	wgs84_to_wgs72(f, l){
		let text = "";
		// Настройки.
		this.base_name = "wgs_84";
		text += "WGS 84<br>";
		text += "lat(f): = "+f+"<br>";
		text += "lon(l): = "+l+"<br>";
		f = deg_in_rad(f);
		
		//f = Math.atan((1 + this._e_2) * Math.tan(f));
		
		
		l = deg_in_rad(l);
		
		let h = 0;
		text += "h: = "+h+"<br>";
		// Перевод в X Y Z
		text += "Перевод в X Y Z<br>";
		let z = this.e_2 / (1 - this.e_2);
		text += "z = "+z+"<br>";
		let v = this.a / Math.pow(1 - this.e_2 * Math.pow(Math.sin(f), 2), 1 / 2);
		text += "v = "+v+"<br>";
		let X = (v + h) * Math.cos(f) * Math.cos(l);
		text += "X = "+X+"<br>";
		let Y = (v + h) * Math.cos(f) * Math.sin(l);
		text += "Y = "+Y+"<br>";
		let Z = ((1 - this.e_2) * v + h) * Math.sin(f);
		text += "Z = "+Z+"<br>";
		// смена системы
		text += "смена системы<br>";
		// Настройки.
		let tX = 0;
		let tY = 0;
		let tZ = 4.5;
		X -= tX;
		Y -= tY;
		Z -= tZ;
		let rX = 0;
		let rY = 0;
		let rZ = 0.0000026858677933468294;
		//let M = 0.2263;
		//let M = 1 / 1.0000002263;
		let M = 1 / 1.000000219;
		let Xs = M * (X + rZ * Y - rY * Z);
		text += "Xs = "+Xs+"<br>";
		let Ys = M * (-rZ * X + Y + rX * Z);
		text += "Ys = "+Ys+"<br>";
		let Zs = M * (rY * X - rX * Y + Z);
		text += "Zs = "+Zs+"<br>";
		
		X = Xs;
		Y = Ys;
		Z = Zs;
		
		// Перевод в _f _l
		text += "Перевод в _f _l<br>";
		// Настройки.
		this.base_name = "wgs_72";
		
		
		
		z = this.e_2 / (1 - this.e_2);
		text += "Обратное:<br>";
		let p = Math.pow(Math.pow(X, 2) + Math.pow(Y, 2), 0.5);
		let q = Math.atan2(Z * this.a, p * this.b);
		let fi_interation = 0;
		let vi = 0;
		let i = 7;
		while(i--){
			vi = this.a / Math.pow(1 - this.e_2 * Math.pow(Math.sin(fi_interation), 2), 1 / 2);
			fi_interation = Math.atan2(Z + this.e_2 * vi * Math.sin(fi_interation), p);
		}
		let fi = Math.atan2(Z + z * this.b * Math.pow(Math.sin(q), 3), p - this.e_2 * this.a * Math.pow(Math.cos(q), 3));
		text += "f = "+rad_in_deg(fi)+"<br>";
		let li = Math.atan2(Y, X);
		text += "l = "+rad_in_deg(li)+"<br>";
		let hi = X * (1 / Math.cos(li)) * (1 / Math.cos(fi_interation)) - vi;
		text += "h = "+hi+"<br>";
		let hi2 = (p / Math.cos(fi_interation)) - vi;
		text += "h = "+hi2+"<br>";
		
		return text;
	}
	
	
}

/// Далее функции по главам.
var geo_n = "wgs_84";

///Вспомогательные
function deg_in_rad(deg){
	return deg * Math.PI / 180;}
function rad_in_deg(rad){
	return rad / Math.PI * 180;}
function ddmmss_in_deg(text){
	let deg = 0;
	let t = /([0-9]+)°/.exec(text)[1];
	if(t)deg = t * 1;
	t = /([0-9]+)'/.exec(text)[1];
	if(t)deg += t / 60;
	t = /'([0-9.]+)/.exec(text)[1];
	if(t)deg += t / 3600;
	
	return deg;
}
function ddmmss_in_rad(text){
	return deg_in_rad(ddmmss_in_deg(text));}
// данные для тестов.
var coor_a = {lat:55,lng:83};
var coor_b = {lat:55,lng:84};
function test(){
	let text = "<h2>Geomatics Guidance Note Number 7, part 2.</h2><br>";
	text += "<b>Fi(lat) = 55, L(lon) = 83</b><br>";
	let geods = new Geods();
	// стр. 6
	text += "a = "+geods.a+"<br>";
	text += "b = "+geods.b+"<br>";
	text += "f = "+geods.f+"<br>";
	text += "e = "+geods.e+"<br>";
	text += "e² = "+geods.e_2+"<br>";
	text += "e' = "+geods._e+"<br>";
	text += "p = "+geods.p+"<br>";
	text += "v = "+geods.v+"<br>";
	text += "Ra = "+geods.Ra+"<br>";
	text += "Rc = "+geods.Rc+"<br>";
	
	// стр. 19
	/*
	text += "<b>3.1.1.1  Lambert Conic Conformal (2SP)</b><br>";
	text += "<b>EPSG:32040</b><br>";
	geods.base_name = "EPSG_32040";
	text += "a = "+geods.a+"<br>";
	text += "b = "+geods.b+"<br>";
	text += "f = "+geods.f+"<br>";
	text += "e = "+geods.e+"<br>";
	text += "e² = "+geods.e_2+"<br>";
	text += "e' = "+geods._e+"<br>";
	text += "p = "+geods.p+"<br>";
	text += "v = "+geods.v+"<br>";
	text += "Ra = "+geods.Ra+"<br>";
	text += "Rc = "+geods.Rc+"<br>";
	text += "lambert_2SP: Пример 1.<br>"+geods.lambert_2SP(0.48578331, -1.72787596, 0.49538262, 0.52854388, 2000000, 0, 0.49741884, -1.67551608, 20925832.16)+"<br>";
	geods.base_name = "EPSG_3110";
	// lambert_2SP(Ff, Lf, F1, F2, Ef, Nf, F, L, a = this.a)
	text += "lambert_2SP: Пример 2.<br>"+geods.lambert_2SP(-0.64577182, 2.530727415, -0.62831853, -0.66322512, 2500000, 4500000, -0.658861793, 2.5263640923)+"<br>";
	//*/
	// стр. 22
	/*
	text += "<b>3.1.1.2  Lambert Conic Conformal (1SP)</b><br>";
	geods.base_name = "JAD69";
	//lambert_1SP(F0, L0, K0, FE, FN, F, L, a = this.a)
	text += "lambert_1SP: Пример.<br>"+geods.lambert_1SP(0.31415927, -1.34390352, 1, 250000, 150000, 0.31297535, -1.34292061)+"<br>";
	*/
	// стр. 97
	/*
	text += "<b>4.1.1  Geographic/Geocentric conversions</b><br>";
	//conversion_in_geocentric(name_system, F, L)
	text += "Пример:(стр. 98)<br>"+geods.conversion_in_geocentric("wgs_84", 0.9391511015599004, 0.037167659085845246, 73);
	//*/
	// стр. 101
	//text += "Пример:(стр. 101)<br>"+geods.conversion_in_topocentric("wgs_84", 3652755.3058, 319574.6799, 5201547.3536, 3771793.968, 140253.342, 5124304.349);
	// стр. 110
	//helmert7(X, Y, Z, tX, tY, tZ, rX, rY, rZ, dS)
	text += "Пример:(стр. 110)<br>"+geods.helmert7(3657660.66, 255768.55, 5201382.11, 0, 0, 4.5, 0, 0, deg_in_rad(0.554 / 3600), 1.000000219);
	text += "Пример:(стр. 110)<br>"+geods.helmert7(3657660.66, 255768.55, 5201382.11, 0, 0, 4.5, 0, 0, 0.000002685868, 1.000000219);
	
	text += geods.wgs84_to_wgs72(55, 83);
	//text += geods.wgs84_to_wgs72(0, 0);
	
	
	//alert(deg_in_rad(0.554 / 3600));
	
	
	
	
	//alert(ddmmss_in_rad("2°07'46.380"));
	
	
	out(text);
}
function out(text){
	document.getElementById("output").innerHTML=text;
}
function info(text){
	document.getElementById("info").innerHTML=text;
}


































