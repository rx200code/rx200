/// ФУНКЦИИ И ПАРАМЕТРЫ смены систем/проекций координат.

// Дол. параметры.
const rad_90 = Math.PI / 2;
const rad_360 = Math.PI * 2;
// датум 84
const a = 6378137;
const w_WM = rad_360 * a;
const _f = 298.257223563;
const df = 1 / _f;
const b = a - a * df;
const e = (2 * df - df ** 2) ** .5;
const e_2 = e ** 2;
const e_4 = e ** 4;
const e_6 = e ** 6;
const _e_2 = e_2 / (1 - e_2);
const e_1 = (1 - (1 - e_2) ** .5) / (1 + (1 - e_2) ** .5);
const e_1_2 = e_1 ** 2;
const e_1_3 = e_1 ** 3;
const e_1_4 = e_1 ** 4;

// Дол. функции.
let x_360 = x => (x %= w_WM) < 0 ? x + w_WM: x;
let d_360 = d => (d %= 360) < 0 ? d + 360: d;
let r_360 = r => (r %= rad_360) < 0 ? r + rad_360: r;
let toRad = deg => deg * Math.PI / 180;
let toDeg = rad => rad / Math.PI * 180;
// 
const rad_6 = toRad(6);
const rad_3 = toRad(3);
let f_z_GK = os => ((rad_6 + r_360(os)) / rad_6) | 0;
let f_z_UTM = os => f_z_GK(os + Math.PI);
let f_os = lr => {
	let os = (lr - lr % rad_6) + rad_3;
	if(lr < 0)os -= rad_6;
	return os;
}

// функции перевода координат. [Lon(L), Lat(F)], из 3857 to в
/// WGS 84
function to_wgs_84_deg(c){
	return [toDeg(c[0] / a), toDeg(rad_90 - 2 * Math.atan(Math.E ** (-c[1] / a)))];
}
function to_wgs_84_rad(c){
	return [c[0] / a, rad_90 - 2 * Math.atan(Math.E ** (-c[1] / a))];
}
function deg_wgs84_to_WM(c){
	let x = Math.tan(toRad(c[1]));
	return [toRad(c[0]) * a, Math.log(x + (x * x + 1) ** .5) * a];
	//return [toRad(c[0]) * a, Math.log(Math.tan(Math.PI / 4 + toRad(c[1]) / 2)) * a];
}
function rad_wgs84_to_WM(c){
	let x = Math.tan(c[1]);
	return [c[0] * a, Math.log(x + (x * x + 1) ** .5) * a];
}
/// UTM USGS
function to_UTM_USGS(c){
	let c_84 = to_wgs_84_rad(c);
	let l = c_84[0];
	let f = c_84[1];
	let s = c_84[1] < 0;
	if(c.length > 2)s = c[3];
	let l_0 = c.length > 2 ? c[2]:f_os(l);//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;
	let FN = 0;
	if(s)FN = 10000000;
	let k_0 = .9996;
	///
	let T = Math.tan(f) ** 2;
	let C = e_2 * Math.cos(f) ** 2 / (1 - e_2);
	let A = (l - l_0) * Math.cos(f);
	let v = a / (1 - e_2 * Math.sin(f) ** 2) ** .5;
	let M_0 = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f_0 - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f_0) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f_0) - (35 * e_6 / 3072) * Math.sin(6 * f_0));
	let M = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f) - (35 * e_6 / 3072) * Math.sin(6 * f));
	let E = FE + k_0 * v * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * _e_2) * A ** 5 / 120);// + f_z_UTM(l_0) * 10 ** 6;// Для уникальных координат независимо от зоны.
	let N = FN + k_0 * (M - M_0 + v * Math.tan(f) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * _e_2) * A ** 6 / 720));
	return [E, N, l_0, s];
}
function from_UTM_USGS(c){
	let E = c[0];
	let N = c[1];
	let l_0 = c[2];//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;// + f_z_UTM(l_0) * 10 ** 6;// Для уникальных координат независимо от зоны.
	let FN = 0;
	if(c[3])FN = 10000000;
	let k_0 = .9996;
	///
	let M_0 = a * ((1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256) * f_0 - (3 * e_2 / 8 + 3 * e_4 / 32 + 45 * e_6 / 1024) * Math.sin(2 * f_0) + (15 * e_4 / 256 + 45 * e_6 / 1024) * Math.sin(4 * f_0) - (35 * e_6 / 3072) * Math.sin(6 * f_0));
	let M_1 = M_0 + (N - FN) / k_0;
	let _n_1 = M_1 / (a * (1 - e_2 / 4 - 3 * e_4 / 64 - 5 * e_6 / 256));
	let f_1 = _n_1 + (3 * e_1 / 2 - 27 * e_1_3 / 32) * Math.sin(2 * _n_1) + (21 * e_1_2 / 16 - 55 * e_1_4 / 32) * Math.sin(4 * _n_1) + (151 * e_1_3 / 96) * Math.sin(6 * _n_1) + (1097 * e_1_4 / 512) * Math.sin(8 * _n_1);
	let v_1 = a / (1 - e_2 * Math.sin(f_1) ** 2) ** .5;
	let p_1 = a * (1 - e_2) / (1 - e_2 * Math.sin(f_1) ** 2) ** 1.5;
	let T_1 = Math.tan(f_1) ** 2;
	let C_1 = _e_2 * Math.cos(f_1) ** 2;
	let D = (E - FE)/(v_1 * k_0);
	let f = f_1 - (v_1 * Math.tan(f_1) / p_1) * (D ** 2 / 2 - (5 + 3 * T_1 + 10 * C_1 - 4 * C_1 ** 2 - 9 * _e_2) * D ** 4 / 24 + (61 + 90 * T_1 + 298 * C_1 + 45 * T_1 ** 2 - 252 * _e_2 - 3 * C_1 ** 2) * D ** 6 / 720);
	let l = l_0 + (D - (1 + 2 * T_1 + C_1) * D ** 3 / 6 + (5 - 2 * C_1 + 28 * T_1 - 3 * C_1 ** 2 + 8 * _e_2 + 24 * T_1 ** 2) * D ** 5 / 120) / Math.cos(f_1);
	
	/* ### test, в ЛА округлено до 6 знаков. ###
	f = toRad(toDeg(f).toFixed(6));// Полностью совпадает с сеткой ЛА
	l = toRad(toDeg(l).toFixed(6));// Полностью совпадает с сеткой ЛА
	// ######################################### */
	return rad_wgs84_to_WM([l, f]);
}
/// UTM JHS
function to_UTM_JHS(c){
	// координаты 84
	let c_84 = to_wgs_84_rad(c);
	let l = c_84[0];
	let f = c_84[1];
	let s = c_84[1] < 0;
	if(c.length > 2)s = c[3];
	let l_0 = c.length > 2 ? c[2]:f_os(l);//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;
	let FN = 0;
	if(s)FN = 10000000;
	let k_0 = .9996;
	///
	let n = df / (2 - df);
	let B = (a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
	let h_1 = n / 2 - (2 / 3) * n ** 2 + (5 / 16) * n ** 3 + (41 / 180) * n ** 4;
	let h_2 = (13 / 48) * n ** 2 - (3 / 5) * n ** 3 + (557 / 1440) * n ** 4;
	let h_3 = (61 / 240) * n ** 3 - (103 / 140) * n ** 4;
	let h_4 = (49561 / 161280) * n ** 4;
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
	
	return [E, N, l_0, s];
}
function from_UTM_JHS(c){
	let E = c[0];
	let N = c[1];
	let l_0 = c[2];//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;// + f_z_UTM(l_0) * 10 ** 6;// Для уникальных координат независимо от зоны.
	let FN = 0;
	if(c[3])FN = 10000000;
	let k_0 = .9996;
	///
	let n = df / (2 - df);
	let B = (a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
	
	let h_1 = n / 2 - (2 / 3) * n ** 2 + (37 / 96) * n ** 3 - (1 / 360) * n ** 4;
	let h_2 = (1 / 48) * n ** 2 + (1 / 15) * n ** 3 - (437 / 1440) * n ** 4;
	let h_3 = (17 / 480) * n ** 3 - (37 / 840) * n ** 4;
	let h_4 = (4397 / 161280) * n ** 4;
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
	let _n = (E - FE) / (B * k_0);
	let W = ((N - FN) + k_0 * M_0) / (B * k_0);
	
	let W_1 = h_1 * Math.sin(2 * W) * Math.cosh(2 * _n);
	let W_2 = h_2 * Math.sin(4 * W) * Math.cosh(4 * _n);
	let W_3 = h_3 * Math.sin(6 * W) * Math.cosh(6 * _n);
	let W_4 = h_4 * Math.sin(8 * W) * Math.cosh(8 * _n);
	let W_0 = W - (W_1 + W_2 + W_3 + W_4);
	
	let n_1 = h_1 * Math.cos(2 * W) * Math.sinh(2 * _n);
	let n_2 = h_2 * Math.cos(4 * W) * Math.sinh(4 * _n);
	let n_3 = h_3 * Math.cos(6 * W) * Math.sinh(6 * _n);
	let n_4 = h_4 * Math.cos(8 * W) * Math.sinh(8 * _n);
	let n_0 = _n - (n_1 + n_2 + n_4 + n_4);
	
	let _B = Math.asin(Math.sin(W_0) / Math.cosh(n_0));
	let Q_1 = Math.asinh(Math.tan(_B));
	let Q_2 = Q_1 + (e * Math.atanh(e * Math.tanh(Q_1)));
	for(let i = 0; i < 6; i++)Q_2 = Q_1 + (e * Math.atanh(e * Math.tanh(Q_2)));
	
	let f = Math.atan(Math.sinh(Q_2));
	let l = l_0 + Math.asin(Math.tanh(n_0) / Math.cos(_B));
	
	return rad_wgs84_to_WM([l, f]);
}
/// WGS 72
function xto_wgs_72(){
	
	let Xs = -3789470.71;
	let Ys = 4841770.404;
	let Zs = -1690893.952;
	let t = 2013.9
	
	
	let tX = -84.68;
	let tY = -19.42;
	let tZ = 32.01;
	
	let rX = -0.4254;
	let rY = 2.2578;
	let rZ = 2.4015;
	
	let dS = 0.00971;
	
	let t0 = 1994;
	
	let dtX = 1.42;
	let dtY = 1.34;
	let dtZ = 0.90;
	
	let drX = 1.5461;
	let drY = 1.1820;
	let drZ = 1.1551;
	
	let ddS = 0.000109;
	
	let _t = t - t0;
	
	let _c = -1;
	
	let _tX = (tX + dtX * _t) * .001;
	let _tY = (tY + dtY * _t) * .001;
	let _tZ = (tZ + dtZ * _t) * .001;
	
	let _rX = rX + drX * _t;
	let _rY = rY + drY * _t;
	let _rZ = rZ + drZ * _t;
	
	let _dS = dS + ddS * _t;
	
	_rX = toRad(_rX / 60 / 60 / 1000) * _c;
	_rY = toRad(_rY / 60 / 60 / 1000) * _c;
	_rZ = toRad(_rZ / 60 / 60 / 1000) * _c;
	
	let _M = 1 + _dS * 10 ** -6;
	
	
	
	let Xt = _M * (Xs - _rZ * Ys + _rY * Zs) + _tX;
	let Yt = _M * (_rZ * Xs + Ys - _rX * Zs) + _tY;
	let Zt = _M * (-_rY * Xs + _rX * Ys + Zs) + _tZ;
	
	
	return Xt+"\n"+Yt+"\n"+Zt;
	//return _rX+"\n"+_rY+"\n"+_rZ;
	//return _tX+"\n"+_tY+"\n"+_tZ;
	
}
//alert(xto_wgs_72());
/// SK 42
function to_pz_90_11(c){
	let c_84 = to_wgs_84_rad(c);
	//c_84 = c;// TEST
	let l = c_84[0];
	let f = c_84[1];
	
	let z = e_2 / (1 - e_2);
	let v = a / Math.pow(1 - e_2 * Math.pow(Math.sin(f), 2), 1 / 2);
	let X = v * Math.cos(f) * Math.cos(l);
	let Y = v * Math.cos(f) * Math.sin(l);
	let Z = (1 - e_2) * v * Math.sin(f);
	
	//let proj4_4322 = '+proj=longlat +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +no_defs ';// WGS 72
	//let proj4_4284 = '+proj=longlat +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +no_defs';// Pulkovo 1942
	
	
	let tX = -23.57;
	let tY = 140.95;
	let tZ = 79.8;
	
	let rX = 0;
	let rY = toRad(0.35 / 3600);
	let rZ = toRad(0.79 / 3600);
	
	let M = 1 - 0.00000022;
	
	let Xt = ((X - rZ * Y + rY * Z) + tX) / M;
	let Yt = ((rZ * X + Y - rX * Z) + tY) / M;
	let Zt = ((-rY * X + rX * Y + Z) + tZ) / M;
	
	//
	let at = 6378245;
	let _ft = 298.3;
	let dft = 1 / _ft;
	let bt = at * (1 - dft);
	let e_2t = 2 * dft - dft ** 2;//?
	let _e_2t = e_2t / (1 - e_2t);
	
	let p = Math.pow(Math.pow(Xt, 2) + Math.pow(Yt, 2), 0.5);
	let q = Math.atan2(Zt * at, p * bt);
	let zt = e_2t / (1 - e_2t);
	return [Math.atan2(Yt, Xt), Math.atan2(Zt + zt * bt * Math.pow(Math.sin(q), 3), p - e_2t * at * Math.pow(Math.cos(q), 3))];
}
//alert(to_sk_42([83, 55].map(toRad)).map(toDeg));

function from_pz_90_11(c){
	//
	let at = 6378245;
	let _ft = 298.3;
	let dft = 1 / _ft;
	let bt = at * (1 - dft);
	let e_2t = 2 * dft - dft ** 2;//?
	//
	let l = c[0];
	let f = c[1];
	
	let v = at / Math.pow(1 - e_2t * Math.pow(Math.sin(f), 2), 1 / 2);
	let X = v * Math.cos(f) * Math.cos(l);
	let Y = v * Math.cos(f) * Math.sin(l);
	let Z = (1 - e_2t) * v * Math.sin(f);
	
	let tX = 23.57;
	let tY = -140.95;
	let tZ = -79.8;
	
	let rX = 0;
	let rY = toRad(-0.35 / 3600);
	let rZ = toRad(-0.79 / 3600);
	
	let M = 1 + 0.00000022;
	
	let Xt = M * (X - rZ * Y + rY * Z) + tX;
	let Yt = M * (rZ * X + Y - rX * Z) + tY;
	let Zt = M * (-rY * X + rX * Y + Z) + tZ;
	
	let p = Math.pow(Math.pow(Xt, 2) + Math.pow(Yt, 2), 0.5);
	let q = Math.atan2(Zt * a, p * b);
	let zt = e_2 / (1 - e_2);
	
	return rad_wgs84_to_WM([Math.atan2(Yt, Xt), Math.atan2(Zt + zt * b * Math.pow(Math.sin(q), 3), p - e_2 * a * Math.pow(Math.cos(q), 3))]);
	
}














// Функции на основе Proj4js
let proj4_3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';// Web Mercator
let proj4_4326 = '+proj=longlat +datum=WGS84 +no_defs';// WGS 84
let proj4_4322 = '+proj=longlat +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +no_defs ';// WGS 72
let proj4_4284 = '+proj=longlat +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +no_defs';// Pulkovo 1942

function to_4284_proj4(c){// Pulkovo 1942
	return proj4(proj4_3857, proj4_4284, c);
}
function from_4284_proj4(c){
	return proj4(proj4_4284, proj4_3857, c);
}

function to_GK2_proj4(c){// гаусса крюгера.
	let c_sk42 = to_wgs_84_proj4([c[0], c[1]]);
	
	
	let os = 0;
	let s = false;
	let z = 0;
	if(c.length > 2){
		os = c[2];
		s = c[3];
		z = c[4];
	}else{
		os = f_os(toRad(c_sk42[0]));
		s = c_sk42[1] < 0;
		z = f_z_GK(os);
	}
	//let arr = proj4(proj4_3857, '+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs', c);
	let arr = proj4(proj4_4326, '+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +units=m +no_defs', c_sk42);
	if(arr[1] < 0)arr[1] *= -1;
	//arr.push((s ? "z:"+z+" S": "z:"+z+" N"));
	arr.push(os, s, z);
	return arr;
}
function from_GK2_proj4(c){// гаусса крюгера.
	let z = c[4];
	c.length = 2;
	let c_sk42 = proj4('+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +units=m +no_defs', proj4_4326, c);
	return from_wgs_84_proj4(c_sk42);
}

function to_GK_proj4(c){// гаусса крюгера.
	let c_sk42 = to_4284_proj4([c[0], c[1]]);
	
	
	let os = 0;
	let s = false;
	let z = 0;
	if(c.length > 2){
		os = c[2];
		s = c[3];
		z = c[4];
	}else{
		os = f_os(toRad(c_sk42[0]));
		s = c_sk42[1] < 0;
		z = f_z_GK(os);
	}
	//let arr = proj4(proj4_3857, '+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs', c);
	let arr = proj4(proj4_4284, '+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs', c_sk42);
	if(arr[1] < 0)arr[1] *= -1;
	//arr.push((s ? "z:"+z+" S": "z:"+z+" N"));
	arr.push(os, s, z);
	return arr;
}
function from_GK_proj4(c){// гаусса крюгера.
	let z = c[4];
	c.length = 2;
	let c_sk42 = proj4('+proj=tmerc +lat_0=0 +lon_0='+((z - 1) * 6 + 3)+' +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs', proj4_4284, c);
	return from_4284_proj4(c_sk42);
}

function to_wgs_84_proj4(c){
	return proj4(proj4_3857, proj4_4326, c);
}
function from_wgs_84_proj4(c){
	return proj4(proj4_4326, proj4_3857, c);
}
function to_wgs_72_proj4(c){
	return proj4(proj4_3857, proj4_4322, c);
}
function from_wgs_72_proj4(c){
	return proj4(proj4_4322, proj4_3857, c);
}
function to_wgs_84_proj4_re(c){
	let c_wgs_84 = proj4(proj4_3857, proj4_4326, c);
	c_wgs_84[0] = d_360(c_wgs_84[0]);
	return c_wgs_84;
}
function to_UTM_proj4(c){
	let c_wgs_84 = to_wgs_84_proj4_re([c[0], c[1]]);
	let z = 0;
	let s = false;
	if(c.length > 2){
		os = c[2];
		s = c[3];
		z = c[4];
	}else{
		os = f_os(toRad(c_wgs_84[0]));
		s = c_wgs_84[1] < 0;
		z = f_z_UTM(os);
	}
	let arr = proj4(proj4_4326, '+proj=utm +zone='+z+' '+(s ? "+south ": "")+'+datum=WGS84 +units=m +no_defs', c_wgs_84);
	//arr.push((s ? "z:"+z+" S": "z:"+z+" N"));
	arr.push(os, s, z);
	return arr;
}
function from_UTM_proj4(c){
	let z = c[4];
	let s = c[3];
	c.length = 2;
	let c_wgs_84 = proj4('+proj=utm +zone='+z+' '+(s ? "+south ": "")+'+datum=WGS84 +units=m +no_defs', proj4_4326, c);
	return from_wgs_84_proj4(c_wgs_84);
}


/// #######################################
let crs = {};
// Эллипсойды
crs.ell = {
	wgs_84:{a:6378137,_f:298.257223563,epsg:7030},
	k_1940:{a:6378245,_f:298.3,epsg:7024},//Krassowsky_1940
	gsk_2011:{a:6378136.5,_f:298.2564151,epsg:1025},
	grs_1980:{a:6378137,_f:298.257222101,epsg:7019},
	pz_90:{a:6378136,_f:298.257839303,epsg:7054}
};
for(let key in crs.ell){
	let ell = crs.ell[key];
	ell.f = 1 / ell._f;
	ell.b = ell.a - ell.a * ell.f;
	ell.e_2 = 2 * ell.f - ell.f ** 2;
	ell.e = ell.e_2 ** .5;
	ell.e_4 = ell.e ** 4;
	ell.e_6 = ell.e ** 6;
	ell._e_2 = ell.e_2 / (1 - ell.e_2);
}
// Элементы трансформации, если не указана одна из систем то она wgs_84
crs.et = {};
//crs.et.from_sk_42 = [47.49,-282.22,-160.7,0,0,0.03,-0.34];// GK Proj4js
//crs.et.from_sk_42 = [23.92, -141.27, -80.9, 0.0, -0.35, -0.82, -0.12];// EPSG:1267 Pulkovo 1942 to WGS 84 (17)
//crs.et.from_sk_42 = [28.0, -130.0, -95.0, 0.0, 0.0, 0.0, 0.0];// EPSG:1254 Pulkovo 1942 to WGS 84 (1)
crs.et.from_sk_42 = [23.57, -140.95, -79.8, 0.0, -0.35, -0.79, -0.22];// EPSG:5044 Pulkovo 1942 to WGS 84 (20)// оптимальная.
crs.et.to_sk_42 = crs.et.from_sk_42.map(n => n * -1);
crs.et.from_sk_42_GK = [23.92,-141.27,-80.9,-0,0.35,0.82,-0.12];// EPSG:28402 - 28432 - последние две цыфры номер зоны, от 2 до 32. Pulkovo 1942 / Gauss-Kruger
crs.et.to_sk_42_GK = crs.et.from_sk_42_GK.map(n => n * -1);

for(let key in crs.et){
	crs.et[key][3] = toRad(crs.et[key][3] / 3600);
	crs.et[key][4] = toRad(crs.et[key][4] / 3600);
	crs.et[key][5] = toRad(crs.et[key][5] / 3600);
	crs.et[key][6] = 1 + crs.et[key][6] * 10 ** -6;
}

/// Методв.
crs.bl_to_xyz = (c, el) => {// EPSG:9602
	let v = el.a / (1 - el.e_2 * Math.sin(c[1]) ** 2) ** .5;
	return [v * Math.cos(c[1]) * Math.cos(c[0]), v * Math.cos(c[1]) * Math.sin(c[0]), (1 - el.e_2) * v * Math.sin(c[1])];
};
crs.xyz_to_bl = (c, el) => {// EPSG:9602
	let p = (c[0] ** 2 + c[1] ** 2) ** 0.5;
	let q = Math.atan2(c[2] * el.a, p * el.b);
	let zt = el.e_2 / (1 - el.e_2);
	return [Math.atan2(c[1], c[0]), Math.atan2(c[2] + zt * el.b * Math.sin(q) ** 3, p - el.e_2 * el.a * Math.cos(q) ** 3)];
};
crs.helmert7 = (c, et) => [et[6] * (c[0] - et[5] * c[1] + et[4] * c[2]) + et[0], et[6] * (et[5] * c[0] + c[1] - et[3] * c[2]) + et[1], et[6] * (-et[4] * c[0] + et[3] * c[1] + c[2]) + et[2]];// EPSG:1033

crs.crs_to_crs = (c, el_s, el_t, et) => {// EPSG:9605 Метод Молоденского без перевода в X, Y, Z.
	let ps = el_s.a * (1 - el_s.e_2) / (1 - el_s.e_2 * Math.sin(c[1]) ** 2) ** (3 / 2);
	let vs = el_s.a / (1 - el_s.e_2 * Math.sin(c[1]) ** 2) ** .5;
	let da = el_t.a - el_s.a;
	let df = el_t.f - el_s.f;
	
	
	let _df = toRad((-et[0] * Math.sin(c[1]) * Math.cos(c[0]) - et[1] * Math.sin(c[1]) * Math.sin(c[0]) + et[2] * Math.cos(c[1]) + (el_s.a * df + el_s.f * da) * Math.sin(2 * c[1])) / (ps * Math.sin(toRad(1 / 3600))) / 3600);
	let _dl = toRad((-et[0] * Math.sin(c[0]) + et[1] * Math.cos(c[0])) / (vs * Math.cos(c[1]) * Math.sin(toRad(1 / 3600))) / 3600);
	
	
	return [c[0] + _dl, c[1] + _df];
};
// Системы координат.
/* TEST
let my_c = [83+360, 55];
alert(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(my_c.map(toRad), crs.ell.wgs_84), crs.et.to_sk_42), crs.ell.k_1940).map(toDeg));
//*/
let xto_tt = c => {
	let c_84 = to_wgs_84_rad(c);
	
	c_84[0] = Math.PI + 0.0000304821987490;
	let text = "<b>c_84</b></br>"+c_84[0]+"<br>"+toDeg(c_84[0])+"<br>";
	
	let xyz = crs.bl_to_xyz(c_84, crs.ell.wgs_84);
	text += "<b>xyz</b></br>"+xyz[0]+"<br>"+xyz[1]+"<br>"+xyz[2]+"<br>";
	
	let h_xyz = crs.helmert7(xyz, crs.et.to_sk_42);
	text += "<b>h_xyz</b></br>"+h_xyz[0]+"<br>"+h_xyz[1]+"<br>"+h_xyz[2]+"<br>";
	
	let c_out = crs.xyz_to_bl(h_xyz, crs.ell.k_1940);
	text += "<b>c_out</b></br>"+c_out[0]+"<br>"+toDeg(c_out[0])+"<br>";
	
	document.getElementById("test_out_deg").innerHTML = text;
	
	return c_out;
};
let to_tt = c => {
	let c_84 = to_wgs_84_rad(c);
	let c_out = crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c_84, crs.ell.wgs_84), crs.et.to_sk_42), crs.ell.k_1940);
	
	// так как функции пересчета возвращают координаты от -180 до 180, особенность синусов и косинусов,
	// то надо корректировать значения чтоб были любые углы, путем приближения к исходным координатам, так как преобразованные не могут отличаться больше чем на 90 градусов.
	if(c_84[0] > rad_90 || c_84[0] < -rad_90){
		if(c_out[0] < c_84[0])while(c_84[0] - c_out[0] > rad_90)c_out[0] += Math.PI;
		else while(c_out[0] - c_84[0] > rad_90)c_out[0] -= Math.PI;
	}
	return c_out;
	
};
let from_tt = c => {
	
	let c_out = crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c, crs.ell.k_1940), crs.et.from_sk_42), crs.ell.wgs_84);
	
	if(c[0] > rad_90 || c[0] < -rad_90){
		if(c_out[0] < c[0])while(c[0] - c_out[0] > rad_90)c_out[0] += Math.PI;
		else while(c_out[0] - c[0] > rad_90)c_out[0] -= Math.PI;
	}
	
	return rad_wgs84_to_WM(c_out);
	//*/
};
let to_tt_2 = c => crs.crs_to_crs(to_wgs_84_rad(c), crs.ell.wgs_84, crs.ell.k_1940, crs.et.to_sk_42);
let from_tt_2 = c => rad_wgs84_to_WM(crs.crs_to_crs(c, crs.ell.k_1940, crs.ell.wgs_84, crs.et.from_sk_42));

/* Надо протестировать на скорость методы.
let my_c = [83, 55];
alert(crs.crs_to_crs(my_c.map(toRad), crs.ell.wgs_84, crs.ell.k_1940, crs.et.to_sk_42).map(toDeg));
alert(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(my_c.map(toRad), crs.ell.wgs_84), crs.et.to_sk_42), crs.ell.k_1940).map(toDeg));
//*/

/// UTM JHS GK
let test_FN = 0;// TEST не оно
function to_UTM_JHS_GK(c){
	// координаты 84
	let c_84 = to_tt(c);
	let l = c_84[0];
	let f = c_84[1];
	let s = c_84[1] < 0;
	if(c.length > 2)s = c[3];
	let l_0 = c.length > 2 ? c[2]:f_os(l);//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;
	let FN = 0;
	if(s)FN = 10000000;
	
	FN += test_FN;// TEST
	
	let k_0 = 1;
	///
	// временно определяем эллипсойд
	let df = crs.ell.k_1940.f;
	let a = crs.ell.k_1940.a;
	let e = crs.ell.k_1940.e;
	
	//
	let n = df / (2 - df);
	let B = (a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
	let h_1 = n / 2 - (2 / 3) * n ** 2 + (5 / 16) * n ** 3 + (41 / 180) * n ** 4;
	let h_2 = (13 / 48) * n ** 2 - (3 / 5) * n ** 3 + (557 / 1440) * n ** 4;
	let h_3 = (61 / 240) * n ** 3 - (103 / 140) * n ** 4;
	let h_4 = (49561 / 161280) * n ** 4;
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
	
	return [E, N, l_0, s];
}
function from_UTM_JHS_GK(c){
	let E = c[0];
	let N = c[1];
	let l_0 = c[2];//os
	// Настройки.
	let f_0 = toRad(0);
	let FE = 500000;// + f_z_UTM(l_0) * 10 ** 6;// Для уникальных координат независимо от зоны.
	let FN = 0;
	if(c[3])FN = 10000000;
	
	FN += test_FN;// TEST
	
	let k_0 = 1;
	///
	// временно определяем эллипсойд
	let df = crs.ell.k_1940.f;
	let a = crs.ell.k_1940.a;
	let e = crs.ell.k_1940.e;
	
	//
	
	let n = df / (2 - df);
	let B = (a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
	
	let h_1 = n / 2 - (2 / 3) * n ** 2 + (37 / 96) * n ** 3 - (1 / 360) * n ** 4;
	let h_2 = (1 / 48) * n ** 2 + (1 / 15) * n ** 3 - (437 / 1440) * n ** 4;
	let h_3 = (17 / 480) * n ** 3 - (37 / 840) * n ** 4;
	let h_4 = (4397 / 161280) * n ** 4;
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
	let _n = (E - FE) / (B * k_0);
	let W = ((N - FN) + k_0 * M_0) / (B * k_0);
	
	let W_1 = h_1 * Math.sin(2 * W) * Math.cosh(2 * _n);
	let W_2 = h_2 * Math.sin(4 * W) * Math.cosh(4 * _n);
	let W_3 = h_3 * Math.sin(6 * W) * Math.cosh(6 * _n);
	let W_4 = h_4 * Math.sin(8 * W) * Math.cosh(8 * _n);
	let W_0 = W - (W_1 + W_2 + W_3 + W_4);
	
	let n_1 = h_1 * Math.cos(2 * W) * Math.sinh(2 * _n);
	let n_2 = h_2 * Math.cos(4 * W) * Math.sinh(4 * _n);
	let n_3 = h_3 * Math.cos(6 * W) * Math.sinh(6 * _n);
	let n_4 = h_4 * Math.cos(8 * W) * Math.sinh(8 * _n);
	let n_0 = _n - (n_1 + n_2 + n_4 + n_4);
	
	let _B = Math.asin(Math.sin(W_0) / Math.cosh(n_0));
	let Q_1 = Math.asinh(Math.tan(_B));
	let Q_2 = Q_1 + (e * Math.atanh(e * Math.tanh(Q_1)));
	for(let i = 0; i < 6; i++)Q_2 = Q_1 + (e * Math.atanh(e * Math.tanh(Q_2)));
	
	let f = Math.atan(Math.sinh(Q_2));
	let l = l_0 + Math.asin(Math.tanh(n_0) / Math.cos(_B));
	
	return from_tt([l, f]);
}

/// ############## Системы координат, проекции ##############
crs.sc = [
	{
		name:"WGS 84",
		epsg:4326,
		title:"",
		f_to:to_wgs_84_rad,
		f_from:rad_wgs84_to_WM
	},
	{
		name:"UTM USGS(идентична ЛА)",
		epsg:0,
		title:"",
		f_to:to_UTM_USGS,
		f_from:from_UTM_USGS,
		f_z:f_z_UTM,
		metre:true,
		zone:true
	},
	{
		name:"UTM JHS",
		epsg:0,
		title:"",
		f_to:to_UTM_JHS,
		f_from:from_UTM_JHS,
		f_z:f_z_UTM,
		metre:true,
		zone:true
	},
	{
		name:"PZ 90.11",
		epsg:7679,
		title:"",
		f_to:to_pz_90_11,
		f_from:from_pz_90_11
	},
	{
		name:"Pulkovo 1942",
		epsg:4284,
		title:"",
		f_to:to_tt,
		f_from:from_tt
	},
	{
		name:"2Pulkovo 1942",
		epsg:4284,
		title:"",
		f_to:to_tt_2,
		f_from:from_tt_2
	},
	{
		name:"Gauss-Kruger",
		epsg:0,
		title:"",
		f_to:to_UTM_JHS_GK,
		f_from:from_UTM_JHS_GK,
		f_z:f_z_GK,
		metre:true,
		zone:true
	},
	{
		name:"Web Mercator",// Название
		epsg:3857,// Код EPSG, или массив кодов EPSG.
		title:"",// Описание
		f_to:c => c,// Перевод из Web Mercator, в данную проекцию, если угловые координаты то в радианы.
		f_from:c => c,// перевод из данной проекции в Web Mercator, если угловые координаты то принимает в радианах.
		metre:true// Угловая или метрическая система. Можно оставить не определенный как undefined
	},
	//Proj4js
	{
		name:"Pulkovo 1942",
		epsg:4284,
		title:"Proj4js",
		f_to:c => to_4284_proj4(c).map(toRad),
		f_from:c => from_4284_proj4(c.map(toDeg))
	},
	{
		name:"Gauss-Kruger",
		epsg:0,
		title:"Proj4js",
		f_to:to_GK_proj4,
		f_from:from_GK_proj4,
		f_z:f_z_GK,
		metre:true,
		zone:true
	},
	{
		name:"2Gauss-Kruger",
		epsg:0,
		title:"Proj4js",
		f_to:to_GK2_proj4,
		f_from:from_GK2_proj4,
		f_z:f_z_GK,
		metre:true,
		zone:true
	},
	{
		name:"WGS 84 Proj4js",
		epsg:4326,
		title:"Proj4js",
		f_to:c => to_wgs_84_proj4(c).map(toRad),
		f_from:c => from_wgs_84_proj4(c.map(toDeg))
	},
	{
		name:"WGS 72 Proj4js",
		epsg:4322,
		title:"Proj4js",
		f_to:c => to_wgs_72_proj4(c).map(toRad),
		f_from:c => from_wgs_72_proj4(c.map(toDeg))
	},
	{
		name:"UTM",
		epsg:0,
		title:"Proj4js",
		f_to:to_UTM_proj4,
		f_from:from_UTM_proj4,
		f_z:f_z_UTM,
		metre:true,
		zone:true
	},
	// OpenLayers
	{
		name:"WGS 84 OpenLayers",
		epsg:4326,
		title:"Proj4js",
		f_to:c => ol.proj.toLonLat(c).map(toRad),
		f_from:c => ol.proj.fromLonLat(c.map(toDeg))
	}
];


/// Методы доступа.
crs.to_f = name => sc.find(elm => elm.name == name).f_to;// Возвращает функцию, для преобразования координат.
crs.from_f = name => sc.find(elm => elm.name == name).f_from;
/// #######################################



/// #########################################################


































