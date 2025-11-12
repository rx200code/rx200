/// ФУНКЦИИ И ПАРАМЕТРЫ смены систем/проекций координат.
// Дол. параметры.
const rad_90 = Math.PI / 2;
const rad_360 = Math.PI * 2;
// Дол. функции.
let d_360 = d => (d %= 360) < 0 ? d + 360: d;
let r_360 = r => (r %= rad_360) < 0 ? r + rad_360: r;
let r_1 = Math.PI / 180;
let toRad = deg => deg * r_1;//let toRad = deg => deg * Math.PI / 180;
let toDeg = rad => rad / r_1;//let toDeg = rad => rad / Math.PI * 180;
/// #######################################
let crs = {};
// Эллипсойды
crs.ell = {
	wgs_84:{a:6378137,_f:298.257223563},// EPSG:7030
	k_1940:{a:6378245,_f:298.3},// EPSG:7024 Krassowsky_1940
};
for(let key in crs.ell){
	let ell = crs.ell[key];
	ell.f = 1 / ell._f;
	ell.b = ell.a - ell.a * ell.f;
	ell.e_2 = 2 * ell.f - ell.f ** 2;
	ell.e = ell.e_2 ** .5;
	ell.e_4 = ell.e ** 4;
	ell.e_6 = ell.e ** 6;
	ell.e_8 = ell.e ** 6;
	ell._e_2 = ell.e_2 / (1 - ell.e_2);
}
// Элементы трансформации, если не указана одна из систем то она wgs_84
crs.et = {};
crs.et.from_sk_42 = [23.57, -140.95, -79.8, 0.0, -0.35, -0.79, -0.22];// EPSG:5044 Pulkovo 1942 to WGS 84 (20)// оптимальная.
crs.et.to_sk_42 = crs.et.from_sk_42.map(n => n * -1);
crs.et.from_sk_42_GK = [23.92,-141.27,-80.9,-0,0.35,0.82,-0.12];// EPSG:28402 - 28432 - последние две цыфры номер зоны, от 2 до 32. Pulkovo 1942 to WGS 84 для, Pulkovo 1942 / Gauss-Kruger
crs.et.to_sk_42_GK = crs.et.from_sk_42_GK.map(n => n * -1);
for(let key in crs.et){
	crs.et[key][3] = toRad(crs.et[key][3] / 3600);
	crs.et[key][4] = toRad(crs.et[key][4] / 3600);
	crs.et[key][5] = toRad(crs.et[key][5] / 3600);
	crs.et[key][6] = 1 + crs.et[key][6] * 10 ** -6;
}
/// Методs.
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
/// WGS 84
let to_wgs_84 = c => [c[0] / crs.ell.wgs_84.a, rad_90 - 2 * Math.atan(Math.E ** (-c[1] / crs.ell.wgs_84.a))];// EPSG:1024
let to_wgs_84_N_E = c => [toDeg(rad_90 - 2 * Math.atan(Math.E ** (-c[1] / crs.ell.wgs_84.a))), toDeg(c[0] / crs.ell.wgs_84.a)];// EPSG:1024 N,E
let from_wgs_84 = c => {// EPSG:1024 (lon, lat), (l, f), (долгота, широта).
	let x = Math.tan(c[1]);
	return [c[0] * crs.ell.wgs_84.a, Math.log(x + (x * x + 1) ** .5) * crs.ell.wgs_84.a];
};
// Меркатор Яндекса.
let to_M = c => {
	let f = rad_90 - 2 * Math.atan(Math.E ** (-c[1] / crs.ell.wgs_84.a));
	let x = Math.tan(f);
	return [c[0], Math.log((x + (x * x + 1) ** .5) * ((1 - crs.ell.wgs_84.e * Math.sin(f)) / (1 + crs.ell.wgs_84.e * Math.sin(f))) ** (crs.ell.wgs_84.e / 2)) * crs.ell.wgs_84.a];
};
let from_M = c => {
	let X = Math.PI / 2 - 2 * Math.atan(Math.E ** (c[1] / crs.ell.wgs_84.a));
	let f = X + Math.sin(2 * X) * (crs.ell.wgs_84.e_2 / 2 + 5 * crs.ell.wgs_84.e_4 / 24 + crs.ell.wgs_84.e_6 / 12 + 13 * crs.ell.wgs_84.e_8 / 360) + Math.sin(4 * X) * (7 * crs.ell.wgs_84.e_4 / 48 + 29 * crs.ell.wgs_84.e_6 / 240 + 811 * crs.ell.wgs_84.e_8 / 11520) + Math.sin(6 * X) * (7 * crs.ell.wgs_84.e_6 / 120 + 81 * crs.ell.wgs_84.e_8 / 1120) + Math.sin(8 * X) * (4279 * crs.ell.wgs_84.e_8 / 161280);
	let x = Math.tan(f);
	return [c[0], Math.log(x + (x * x + 1) ** .5) * -crs.ell.wgs_84.a];
};
let lim_d = 7;// Лимит на знаки после запятой.
let to_wgs_84_gpx = c => {// EPSG:1024 // Для перевода координат в тип координат gpx
	let lon = toDeg(c[0] / crs.ell.wgs_84.a) % 360;
	if(lon >= 180)lon -= 360;
	else if(lon < -180)lon += 360;
	return [parseFloat(lon.toFixed(lim_d)), parseFloat(toDeg(rad_90 - 2 * Math.atan(Math.E ** (-c[1] / crs.ell.wgs_84.a))).toFixed(lim_d))];
};
///
let f_correct_L = (c_correct, c) => {// Вспомогательная.
	// так как функции пересчета возвращают координаты от -180 до 180, особенность синусов и косинусов,
	// то надо корректировать значения чтоб были любые углы, путем приближения к исходным координатам, так как преобразованные не могут отличаться больше чем на 90 градусов.
	if(c[0] > rad_90 || c[0] < -rad_90){
		if(c_correct[0] < c[0])while(c[0] - c_correct[0] > rad_90)c_correct[0] += Math.PI;
		else while(c_correct[0] - c[0] > rad_90)c_correct[0] -= Math.PI;
	}
	return c_correct;
};
let to_sk_42 = c => {
	let c_84 = to_wgs_84(c);
	return f_correct_L(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c_84, crs.ell.wgs_84), crs.et.to_sk_42), crs.ell.k_1940), c_84);
};
let from_sk_42 = c => from_wgs_84(f_correct_L(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c, crs.ell.k_1940), crs.et.from_sk_42), crs.ell.wgs_84), c));

let to_sk_42_GK = c => {
	let c_84 = to_wgs_84(c);
	return f_correct_L(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c_84, crs.ell.wgs_84), crs.et.to_sk_42_GK), crs.ell.k_1940), c_84);
	
};
let from_sk_42_GK = c => from_wgs_84(f_correct_L(crs.xyz_to_bl(crs.helmert7(crs.bl_to_xyz(c, crs.ell.k_1940), crs.et.from_sk_42_GK), crs.ell.wgs_84), c));

/// UTM JHS
// Вспомагательные
const rad_6 = toRad(6);
const rad_3 = toRad(3);
let f_z_GK_any = axis => ((rad_6 + axis) / rad_6) - .5;
let f_z_UTM_any = axis => f_z_GK_any(axis + Math.PI);

let f_a_GK_any = z => (z + .5) * rad_6 - rad_6;

let f_a_UTM_any = z => f_a_GK_any(z) - Math.PI;


let f_z_GK = axis => ((rad_6 + r_360(axis)) / rad_6) | 0;
let f_z_UTM = axis => f_z_GK(axis + Math.PI);
let f_axis = l => {
	let axis = (l - l % rad_6) + rad_3;
	if(l < 0)axis -= rad_6;
	return axis;
};
let f_axis_deg = l => {
	let axis = (l - l % 6) + 3;
	if(l < 0)axis -= 6;
	return axis;
};
// Настройки для функций UTM.
function UTM_options(FE_z, FN, k_0, ell, to_c, from_c, f_z){
	this.FE = 500000;
	this.FE_z = FE_z;
	this.f_z = f_z;
	this.FN = FN;
	this.k_0 = k_0;
	this.el = ell;
	this.to_c = to_c;
	this.from_c = from_c;
	let n = ell.f / (2 - ell.f);
	this.B = (ell.a / (1 + n)) * (1 + n ** 2 / 4 + n ** 4 / 64);
	this.h_1 = n / 2 - (2 / 3) * n ** 2 + (5 / 16) * n ** 3 + (41 / 180) * n ** 4;
	this.h_2 = (13 / 48) * n ** 2 - (3 / 5) * n ** 3 + (557 / 1440) * n ** 4;
	this.h_3 = (61 / 240) * n ** 3 - (103 / 140) * n ** 4;
	this.h_4 = (49561 / 161280) * n ** 4;
	this._h_1 = n / 2 - (2 / 3) * n ** 2 + (37 / 96) * n ** 3 - (1 / 360) * n ** 4;
	this._h_2 = (1 / 48) * n ** 2 + (1 / 15) * n ** 3 - (437 / 1440) * n ** 4;
	this._h_3 = (17 / 480) * n ** 3 - (37 / 840) * n ** 4;
	this._h_4 = (4397 / 161280) * n ** 4;
}
crs.utm_op = {
	UTM:new UTM_options(0, 10000000, .9996, crs.ell.wgs_84, to_wgs_84, from_wgs_84, l_0 => 0),
	GK:new UTM_options(1000000, 0, 1, crs.ell.k_1940, to_sk_42_GK, from_sk_42_GK, f_z_GK)
};
let to_UTM_JHS = (c, op) => {// EPSG:9807, 9824(определяет уникальность координат в каждой зоне)
	let c_to = op.to_c(c);
	let s = c_to[1] < 0;
	if(c.length > 3)s = c[3];
	let l_0 = c.length > 2 ? c[2]:f_axis(c_to[0]);
	let _B = Math.atan(Math.sinh(Math.asinh(Math.tan(c_to[1])) - (op.el.e * Math.atanh(op.el.e * Math.sin(c_to[1])))));
	let n_0 = Math.atanh(Math.cos(_B) * Math.sin(c_to[0] - l_0));
	let W_0 =  Math.asin(Math.sin(_B) * Math.cosh(n_0));
	return [op.FE + op.f_z(l_0) * op.FE_z + op.k_0 * op.B * (n_0 + op.h_1 * Math.cos(2 * W_0) * Math.sinh(2 * n_0) + op.h_2 * Math.cos(4 * W_0) * Math.sinh(4 * n_0) + op.h_3 * Math.cos(6 * W_0) * Math.sinh(6 * n_0) + op.h_4 * Math.cos(8 * W_0) * Math.sinh(8 * n_0)), (s ? op.FN: 0) + op.k_0 * (op.B * (W_0 + op.h_1 * Math.sin(2 * W_0) * Math.cosh(2 * n_0) + op.h_2 * Math.sin(4 * W_0) * Math.cosh(4 * n_0) + op.h_3 * Math.sin(6 * W_0) * Math.cosh(6 * n_0) + op.h_4 * Math.sin(8 * W_0) * Math.cosh(8 * n_0))), l_0, s];
};
let from_UTM_JHS = (c, op) => {// EPSG:9807, 9824
	let _n = (c[0] - (op.FE + op.f_z(c[2]) * op.FE_z)) / (op.B * op.k_0);
	let W = (c[1] - (c[3] ? op.FN: 0)) / (op.B * op.k_0);
	let n_0 = _n - (op._h_1 * Math.cos(2 * W) * Math.sinh(2 * _n) + op._h_2 * Math.cos(4 * W) * Math.sinh(4 * _n) + op._h_3 * Math.cos(6 * W) * Math.sinh(6 * _n) + op._h_4 * Math.cos(8 * W) * Math.sinh(8 * _n));
	let _B = Math.asin(Math.sin(W - (op._h_1 * Math.sin(2 * W) * Math.cosh(2 * _n) + op._h_2 * Math.sin(4 * W) * Math.cosh(4 * _n) + op._h_3 * Math.sin(6 * W) * Math.cosh(6 * _n) + op._h_4 * Math.sin(8 * W) * Math.cosh(8 * _n))) / Math.cosh(n_0));
	let Q_1 = Math.asinh(Math.tan(_B));
	let Q_2 = Q_1 + (op.el.e * Math.atanh(op.el.e * Math.tanh(Q_1)));
	for(let i = 0; i < 6; i++)Q_2 = Q_1 + (op.el.e * Math.atanh(op.el.e * Math.tanh(Q_2)));
	return op.from_c([c[2] + Math.asin(Math.tanh(n_0) / Math.cos(_B)), Math.atan(Math.sinh(Q_2))]);
};
let to_UTM = c => to_UTM_JHS(c, crs.utm_op.UTM);
let from_UTM = c => from_UTM_JHS(c, crs.utm_op.UTM);
let to_UTM_GK = c => to_UTM_JHS(c, crs.utm_op.GK);
let from_UTM_GK = c => from_UTM_JHS(c, crs.utm_op.GK);
/// TEST #############################################
let to_Hotine = (c, op, to_UTM, a) => {// EPSG:9815
	let s, Ec, Nc, fc, lc, ac, flag_90, E, N, D_2;
	let c_crs = op.to_c(c);
	if(c.length !== 9){
		fc = c_crs[1];
		let c_UTM = to_UTM(c);
		Ec = c_UTM[0];
		Nc = c_UTM[1];
		lc = c_crs[0];
		s = c_UTM[3];
		ac = a === undefined ? compass_angle(to_wgs_84(c)): a;
		flag_90 = Math.abs(ac) / Math.PI % 2 === 1;// Так как следующая строка вернет 0 всем углам кратным 180, но 180 это перевернутая, в то время как 360 неперевернутая.
		ac %= Math.PI;
		if(ac > rad_90){
			ac -= Math.PI;
			flag_90 = true;
		}else if(ac < -rad_90){
			ac += Math.PI;
			flag_90 = true;
		}
	}else{
		Ec = c[4];
		Nc = c[5];
		lc = c[2];
		fc = c[6];
		s = c[3];
		ac = c[7];
		flag_90 = c[8];
	}
	
	let e = op.el.e;
	let e_2 = op.el.e_2;
	///
	let B = (1 + (e_2 * Math.cos(fc) ** 4 / (1 - e_2))) ** .5;
	let A = op.el.a * B * op.k_0 * (1 - e_2) ** .5 / (1 - e_2 * Math.sin(fc) ** 2);
	let to = Math.tan(Math.PI / 4 - fc / 2) / ((1 - e * Math.sin(fc)) / (1 + e * Math.sin(fc))) ** (e / 2);
	let D = B * (1 - e_2) ** .5 / (Math.cos(fc) * (1 - e_2 * Math.sin(fc) ** 2) ** .5);
	if(D < 1)D_2 = 1;
	else D_2 = D ** 2;
	let F = D + (D_2 - 1) ** .5 * Math.sign(fc);
	let H = F * to ** B;
	let G = (F - 1 / F) / 2;
	let yo = Math.asin(Math.sin(ac) / D);
	// Необходимо чтоб в asin не поступали значения вроди 1.0000001
	let Gy = G * Math.tan(yo);
	if(Gy > 1)Gy = 1;
	else if(Gy < -1)Gy = -1;
	///
	let lo = lc - Math.asin(Gy) / B;
	let t = Math.tan(Math.PI / 4 - c_crs[1] / 2) / ((1 - e * Math.sin(c_crs[1])) / (1 + e * Math.sin(c_crs[1]))) ** (e / 2);
	let Q = H / t ** B;
	let S = (Q - 1 / Q) / 2;
	let T = (Q + 1 / Q) / 2;
	let V = Math.sin(B * (c_crs[0] - lo));
	let U = (-V * Math.cos(yo) + S * Math.sin(yo)) / T;
	let v = A * Math.log((1 - U) / (1 + U)) / (2 * B);
	let uc = (A / B) * Math.atan2((D_2 - 1) ** .5, Math.cos(ac)) * Math.sign(fc);
	if(Math.abs(ac) === rad_90)uc = A * (lc - lo);
	let u = (A * Math.atan2(S * Math.cos(yo) + V * Math.sin(yo), Math.cos(B * (c_crs[0] - lo))) / B) - (Math.abs(uc) * Math.sign(fc));
	if(flag_90){
		E = Ec - v;
		N = Nc - u;
	}else{
		E = Ec + v;
		N = Nc + u;
	}
	//return [E, N, Ec, Nc, lc, fc, s, ac, flag_90];
	//return [E, N, 2 , 3 , 4 , 5 , 6, ac, flag_90];
	return [E, N, lc, s, Ec, Nc, fc, ac, flag_90];
	//return [E, N, 2 , 3, 4 , 5 , 6 , ac, flag_90];
	//return [E, N, 4 , 6, 2 , 3 , 5 , ac, flag_90];
	
};
let from_Hotine = (c, op) => {// EPSG:9815
	let fc = c[6];
	let ac = c[7];
	let e = op.el.e;
	let e_2 = op.el.e_2;
	let e_4 = op.el.e_4;
	let e_6 = op.el.e_6;
	let e_8 = op.el.e_8;
	///
	let B = (1 + (e_2 * Math.cos(fc) ** 4 / (1 - e_2))) ** .5;
	let A = op.el.a * B * op.k_0 * (1 - e_2) ** .5 / (1 - e_2 * Math.sin(fc) ** 2);
	let to = Math.tan(Math.PI / 4 - fc / 2) / ((1 - e * Math.sin(fc)) / (1 + e * Math.sin(fc))) ** (e / 2);
	let D = B * (1 - e_2) ** .5 / (Math.cos(fc) * (1 - e_2 * Math.sin(fc) ** 2) ** .5);
	let D_2 = D ** 2;
	if(D < 1)D_2 = 1;
	let F = D + (D_2 - 1) ** .5 * Math.sign(fc);
	let H = F * to ** B;
	let G = (F - 1 / F) / 2;
	let yo = Math.asin(Math.sin(ac) / D);
	// Необходимо чтоб в asin не поступали значения вроди 1.0000001
	let Gy = G * Math.tan(yo);
	if(Gy > 1)Gy = 1;
	else if(Gy < -1)Gy = -1;
	///
	let lo = c[2] - Math.asin(Gy) / B;
	let vc = 0;
	let uc = (A / B) * Math.atan2((D_2 - 1) ** .5, Math.cos(ac)) * Math.sign(fc);
	if(Math.abs(ac) === rad_90)uc = A * (c[2] - lo);
	let _v, _u;
	if(c[8]){
		_v = c[4] - c[0];
		_u = c[5] - c[1] + (Math.abs(uc) * Math.sign(fc));
	}else{
		_v = c[0] - c[4];
		_u = c[1] - c[5] + (Math.abs(uc) * Math.sign(fc));
	}
	let _Q = Math.E ** -(B * _v / A);
	let _S = (_Q - 1 / _Q) / 2;
	let _T = (_Q + 1 / _Q) / 2;
	let _V = Math.sin(B * _u / A);
	let _U = (_V * Math.cos(yo) + _S * Math.sin(yo)) / _T;
	let _t = (H / ((1 + _U) / (1 - _U)) ** .5) ** (1 / B);
	let X = Math.PI / 2 - 2 * Math.atan(_t);
	return op.from_c([lo - Math.atan2(_S * Math.cos(yo) - _V * Math.sin(yo), Math.cos(B * _u / A)) / B, X + Math.sin(2 * X) * (e_2 / 2 + 5 * e_4 / 24 + e_6 / 12 + 13 * e_8 / 360) + Math.sin(4 * X) * (7 * e_4 / 48 + 29 * e_6 / 240 + 811 * e_8 / 11520) + Math.sin(6 * X) * (7 * e_6 / 120 + 81 * e_8 / 1120) + Math.sin(8 * X) * (4279 * e_8 / 161280)]);
};
let hotine_a = 0;
let to_Hotine_N = c => to_Hotine(c, crs.utm_op.UTM, to_UTM, hotine_a);
let from_Hotine_N = c => from_Hotine(c, crs.utm_op.UTM);
let to_Hotine_C = c => to_Hotine(c, crs.utm_op.UTM, to_UTM);
let from_Hotine_C = c => from_Hotine(c, crs.utm_op.UTM);
// GK
let to_Hotine_N_GK = c => to_Hotine(c, crs.utm_op.GK, to_UTM_GK, hotine_a);
let from_Hotine_N_GK = c => from_Hotine(c, crs.utm_op.GK);
let to_Hotine_C_GK = c => to_Hotine(c, crs.utm_op.GK, to_UTM_GK);
let from_Hotine_C_GK = c => from_Hotine(c, crs.utm_op.GK);
/// END TEST #########################################

/// ############## Системы координат, проекции ##############
let limit_JHS = Math.PI * crs.ell.wgs_84.a * .45;// лимит распространения сетки на экваторе в каждую сторону от оси.
let f_a = c => c[8] ? (c[7] <= 0 ? c[7] + Math.PI: c[7] - Math.PI): c[7];
crs.sc = [
	{// EPSG 4326
		name:"WGS 84",
		title:"EPSG 4326",
		f_to:to_wgs_84,
		f_from:from_wgs_84
	},
	{// EPSG 4326 / 32600(32601 - 32660) - 32700(32701 - 32760), 16000(16001-16060) - 16100(16101-16160), EPSG:9807, 9824
		name:"WGS 84 / UTM",
		title:"EPSG 4326 / 32600(32601 - 32660) - 32700(32701 - 32760), 16000(16001-16060) - 16100(16101-16160), EPSG:9807, 9824",
		op:crs.utm_op.UTM,
		f_to:to_UTM,
		f_from:from_UTM,
		f_z:c => f_z_UTM(c[2]),
		f_z_a:a => f_z_UTM_any(a),
		f_a_z:z => f_a_UTM_any(z),
		f_l:c => c[2],
		f_l_deg:c => Math.round(toDeg(c[2])),
		f_s:c => c[3],
		limit:limit_JHS,
		metre:true,
		zone:true
	},
	{// EPSG:9815 + "WGS 84 / UTM"
		name:"↑ N / UTM / Hotine",
		title:'EPSG:9815 + "WGS 84 / UTM"',
		op:crs.utm_op.UTM,
		f_to:to_Hotine_N,
		f_from:from_Hotine_N,
		f_z:c => f_z_UTM(c[2]),
		f_z_a:a => f_z_UTM_any(a),
		f_a_z:z => f_a_UTM_any(z),
		f_l:c => f_axis(c[2]),
		f_l_deg:c => f_axis_deg(toDeg(c[2])),
		f_s:c => c[3],
		f_a:f_a,
		limit:limit_JHS,
		metre:true,
		center:true,
		angle:true,
		zone:true
	},
	{// EPSG:9815 + "WGS 84 / UTM" + WMM
		name:"🧭 / UTM / Hotine",
		title:'EPSG:9815 + "WGS 84 / UTM" + WMM',
		op:crs.utm_op.UTM,
		f_to:to_Hotine_C,
		f_from:from_Hotine_C,
		f_z:c => f_z_UTM(c[2]),
		f_z_a:a => f_z_UTM_any(a),
		f_a_z:z => f_a_UTM_any(z),
		f_l:c => f_axis(c[2]),
		f_l_deg:c => f_axis_deg(toDeg(c[2])),
		f_s:c => c[3],
		f_a:f_a,
		limit:limit_JHS,
		metre:true,
		center:true,
		zone:true
	},
	{// EPSG 4284-5044
		name:"Pulkovo 1942",
		title:"EPSG 4284-5044",
		f_to:to_sk_42,
		f_from:from_sk_42
	},
	{// EPSG 28402 - 28432, EPSG:9807, 9824
		name:"Pulkovo 1942 / Gauss-Kruger",
		title:"EPSG 28402 - 28432, EPSG:9807, 9824",
		op:crs.utm_op.GK,
		f_to:to_UTM_GK,
		f_from:from_UTM_GK,
		f_z:c => f_z_GK(c[2]),
		f_z_a:a => f_z_GK_any(a),
		f_a_z:z => f_a_GK_any(z),
		f_l:c => c[2],
		f_l_deg:c => Math.round(toDeg(c[2])),
		f_s:c => c[3],
		limit:limit_JHS,
		metre:true,
		zone:true
	},
	{// EPSG:9815 + "Pulkovo 1942 / Gauss-Kruger"
		name:"↑ N / Gauss-Kruger / Hotine",
		title:'EPSG:9815 + "Pulkovo 1942 / Gauss-Kruger"',
		op:crs.utm_op.GK,
		f_to:to_Hotine_N_GK,
		f_from:from_Hotine_N_GK,
		f_z:c => f_z_GK(c[2]),
		f_z_a:a => f_z_GK_any(a),
		f_a_z:z => f_a_GK_any(z),
		f_l:c => f_axis(c[2]),
		f_l_deg:c => f_axis_deg(toDeg(c[2])),
		f_s:c => c[3],
		f_a:f_a,
		limit:limit_JHS,
		metre:true,
		center:true,
		angle:true,
		zone:true
	},
	{// EPSG:9815 + "Pulkovo 1942 / Gauss-Kruger" + WMM
		name:"🧭 / Gauss-Kruger / Hotine",
		title:'EPSG:9815 + "Pulkovo 1942 / Gauss-Kruger" + WMM',
		op:crs.utm_op.GK,
		f_to:to_Hotine_C_GK,
		f_from:from_Hotine_C_GK,
		f_z:c => f_z_GK(c[2]),
		f_z_a:a => f_z_GK_any(a),
		f_a_z:z => f_a_GK_any(z),
		f_l:c => f_axis(c[2]),
		f_l_deg:c => f_axis_deg(toDeg(c[2])),
		f_s:c => c[3],
		f_a:f_a,
		limit:limit_JHS,
		metre:true,
		center:true,
		zone:true
	},
	{// Yandex
		name:"Yandex Mercator",
		title:"Yandex",
		f_to:to_M,
		f_from:from_M,
		metre:true
	},
	{// EPSG 3857
		name:"Web Mercator",// Название
		title:"EPSG 3857",// Описание
		f_to:c => c,// Перевод из Web Mercator, в данную проекцию, если угловые координаты то в радианы.
		f_from:c => c,// перевод из данной проекции в Web Mercator, если угловые координаты то принимает в радианах.
		metre:true// Угловая или метрическая система. Можно оставить не определенный как undefined
	}
];
/// Методы доступа.
crs.get_cs = name => {
	if(name)return crs.sc.find(elm => elm.name == name);
	return crs.sc;
};
crs.to_f = name => crs.get_crs(name).f_to;// Возвращает функцию, для преобразования координат.
crs.from_f = name => crs.get_crs(name).f_from;













// Функция расчета расстояния, формула Бесселя, решение обратной геодезической задачи. (Морозов "Курс сфероидической геодезии")
let get_dist = (c1, c2) => {// Версия для треков. Принимает координаты в системе WGS 84 радианы.
	//let B_1 = c1[1];
	//let B_2 = c2[1];
	//let L_1 = c1[0];
	//let L_2 = c2[0];
	let e_2 = crs.ell.wgs_84.e_2;
	// Подготовительные переменные.
	let W_1 = (1 - e_2 * Math.sin(c1[1]) ** 2) ** .5;
	let W_2 = (1 - e_2 * Math.sin(c2[1]) ** 2) ** .5;
	let sin_u_1 = (Math.sin(c1[1]) * Math.sqrt(1 - e_2)) / W_1;
	let sin_u_2 = (Math.sin(c2[1]) * Math.sqrt(1 - e_2)) / W_2;
	let cos_u_1 = Math.cos(c1[1]) / W_1;
	let cos_u_2 = Math.cos(c2[1]) / W_2;
	let l = c2[0] - c1[0];
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
		let A_1 = Math.atan2(p, q);// Для правильной обрадтнке когда координаты равны, и q = 0 используется функция atan2 вместо Math.atan(p / q);
		if(A_1 < 0)A_1 += rad_360;
		/*
		let A_1 = Math.atan(p / q);
		A_1 = Math.abs(A_1);
		if(p < 0){
			if(q < 0)A_1 = Math.PI + A_1;
			else A_1 = Math.PI * 2 - A_1;
		}else if(q < 0)A_1 = Math.PI - A_1;
		//*/
		// Б
		let sin_si = p * Math.sin(A_1) + q * Math.cos(A_1);
		let cos_si = a_1 + a_2 * Math.cos(la);
		//si = Math.atan2(sin_si, cos_si);
		si = Math.atan(sin_si / cos_si);
		si = Math.abs(si);
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
	return crs.ell.wgs_84.a * si * E_si;// s
	//let A_2 = Math.atan((cos_u_1 * Math.sin(la)) / (b_1 * Math.cos(la) - b_2));
};





/// wmm Коэффиценты 2020 - 2025 и данные.
let wmm_cof = [
	2020.0,
	[{g:-29404.5, h:0.0, g_dot:6.7, h_dot:0.0},{g:-1450.7, h:4652.9, g_dot:7.7, h_dot:-25.1}],
	[{g:-2500.0, h:0.0, g_dot:-11.5, h_dot:0.0},{g:2982.0, h:-2991.6, g_dot:-7.1, h_dot:-30.2},{g:1676.8, h:-734.8, g_dot:-2.2, h_dot:-23.9}],
	[{g:1363.9, h:0.0, g_dot:2.8, h_dot:0.0},{g:-2381.0, h:-82.2, g_dot:-6.2, h_dot:5.7},{g:1236.2, h:241.8, g_dot:3.4, h_dot:-1.0},{g:525.7, h:-542.9, g_dot:-12.2, h_dot:1.1}],
	[{g:903.1, h:0.0, g_dot:-1.1, h_dot:0.0},{g:809.4, h:282.0, g_dot:-1.6, h_dot:0.2},{g:86.2, h:-158.4, g_dot:-6.0, h_dot:6.9},{g:-309.4, h:199.8, g_dot:5.4, h_dot:3.7},{g:47.9, h:-350.1, g_dot:-5.5, h_dot:-5.6}],
	[{g:-234.4, h:0.0, g_dot:-0.3, h_dot:0.0},{g:363.1, h:47.7, g_dot:0.6, h_dot:0.1},{g:187.8, h:208.4, g_dot:-0.7, h_dot:2.5},{g:-140.7, h:-121.3, g_dot:0.1, h_dot:-0.9},{g:-151.2, h:32.2, g_dot:1.2, h_dot:3.0},{g:13.7, h:99.1, g_dot:1.0, h_dot:0.5}],
	[{g:65.9, h:0.0, g_dot:-0.6, h_dot:0.0},{g:65.6, h:-19.1, g_dot:-0.4, h_dot:0.1},{g:73.0, h:25.0, g_dot:0.5, h_dot:-1.8},{g:-121.5, h:52.7, g_dot:1.4, h_dot:-1.4},{g:-36.2, h:-64.4, g_dot:-1.4, h_dot:0.9},{g:13.5, h:9.0, g_dot:-0.0, h_dot:0.1},{g:-64.7, h:68.1, g_dot:0.8, h_dot:1.0}],
	[{g:80.6, h:0.0, g_dot:-0.1, h_dot:0.0},{g:-76.8, h:-51.4, g_dot:-0.3, h_dot:0.5},{g:-8.3, h:-16.8, g_dot:-0.1, h_dot:0.6},{g:56.5, h:2.3, g_dot:0.7, h_dot:-0.7},{g:15.8, h:23.5, g_dot:0.2, h_dot:-0.2},{g:6.4, h:-2.2, g_dot:-0.5, h_dot:-1.2},{g:-7.2, h:-27.2, g_dot:-0.8, h_dot:0.2},{g:9.8, h:-1.9, g_dot:1.0, h_dot:0.3}],
	[{g:23.6, h:0.0, g_dot:-0.1, h_dot:0.0},{g:9.8, h:8.4, g_dot:0.1, h_dot:-0.3},{g:-17.5, h:-15.3, g_dot:-0.1, h_dot:0.7},{g:-0.4, h:12.8, g_dot:0.5, h_dot:-0.2},{g:-21.1, h:-11.8, g_dot:-0.1, h_dot:0.5},{g:15.3, h:14.9, g_dot:0.4, h_dot:-0.3},{g:13.7, h:3.6, g_dot:0.5, h_dot:-0.5},{g:-16.5, h:-6.9, g_dot:0.0, h_dot:0.4},{g:-0.3, h:2.8, g_dot:0.4, h_dot:0.1}],
	[{g:5.0, h:0.0, g_dot:-0.1, h_dot:0.0},{g:8.2, h:-23.3, g_dot:-0.2, h_dot:-0.3},{g:2.9, h:11.1, g_dot:-0.0, h_dot:0.2},{g:-1.4, h:9.8, g_dot:0.4, h_dot:-0.4},{g:-1.1, h:-5.1, g_dot:-0.3, h_dot:0.4},{g:-13.3, h:-6.2, g_dot:-0.0, h_dot:0.1},{g:1.1, h:7.8, g_dot:0.3, h_dot:-0.0},{g:8.9, h:0.4, g_dot:-0.0, h_dot:-0.2},{g:-9.3, h:-1.5, g_dot:-0.0, h_dot:0.5},{g:-11.9, h:9.7, g_dot:-0.4, h_dot:0.2}],
	[{g:-1.9, h:0.0, g_dot:0.0, h_dot:0.0},{g:-6.2, h:3.4, g_dot:-0.0, h_dot:-0.0},{g:-0.1, h:-0.2, g_dot:-0.0, h_dot:0.1},{g:1.7, h:3.5, g_dot:0.2, h_dot:-0.3},{g:-0.9, h:4.8, g_dot:-0.1, h_dot:0.1},{g:0.6, h:-8.6, g_dot:-0.2, h_dot:-0.2},{g:-0.9, h:-0.1, g_dot:-0.0, h_dot:0.1},{g:1.9, h:-4.2, g_dot:-0.1, h_dot:-0.0},{g:1.4, h:-3.4, g_dot:-0.2, h_dot:-0.1},{g:-2.4, h:-0.1, g_dot:-0.1, h_dot:0.2},{g:-3.9, h:-8.8, g_dot:-0.0, h_dot:-0.0}],
	[{g:3.0, h:0.0, g_dot:-0.0, h_dot:0.0},{g:-1.4, h:-0.0, g_dot:-0.1, h_dot:-0.0},{g:-2.5, h:2.6, g_dot:-0.0, h_dot:0.1},{g:2.4, h:-0.5, g_dot:0.0, h_dot:0.0},{g:-0.9, h:-0.4, g_dot:-0.0, h_dot:0.2},{g:0.3, h:0.6, g_dot:-0.1, h_dot:-0.0},{g:-0.7, h:-0.2, g_dot:0.0, h_dot:0.0},{g:-0.1, h:-1.7, g_dot:-0.0, h_dot:0.1},{g:1.4, h:-1.6, g_dot:-0.1, h_dot:-0.0},{g:-0.6, h:-3.0, g_dot:-0.1, h_dot:-0.1},{g:0.2, h:-2.0, g_dot:-0.1, h_dot:0.0},{g:3.1, h:-2.6, g_dot:-0.1, h_dot:-0.0}],
	[{g:-2.0, h:0.0, g_dot:0.0, h_dot:0.0},{g:-0.1, h:-1.2, g_dot:-0.0, h_dot:-0.0},{g:0.5, h:0.5, g_dot:-0.0, h_dot:0.0},{g:1.3, h:1.3, g_dot:0.0, h_dot:-0.1},{g:-1.2, h:-1.8, g_dot:-0.0, h_dot:0.1},{g:0.7, h:0.1, g_dot:-0.0, h_dot:-0.0},{g:0.3, h:0.7, g_dot:0.0, h_dot:0.0},{g:0.5, h:-0.1, g_dot:-0.0, h_dot:-0.0},{g:-0.2, h:0.6, g_dot:0.0, h_dot:0.1},{g:-0.5, h:0.2, g_dot:-0.0, h_dot:-0.0},{g:0.1, h:-0.9, g_dot:-0.0, h_dot:-0.0},{g:-1.1, h:-0.0, g_dot:-0.0, h_dot:0.0},{g:-0.3, h:0.5, g_dot:-0.1, h_dot:-0.1}]
];
let geomagnetic_a = 6371200;
let date_new = new Date();
let date_year = date_new.getUTCFullYear();
let date_year_1 = Date.UTC(date_year, 0, 0, 0, 0, 0);
let date_year_2 = Date.UTC(date_year + 1, 0, 0, 0, 0, 0);
let wmm_time = date_year + (date_new.getTime() - date_year_1) / (date_year_2 - date_year_1);
let wmm_A = crs.ell.wgs_84.a;
let wmm_e_2 = crs.ell.wgs_84.e_2;
/// wmm функции.
let factorial = n => {
	let result = 1;
	while(n)result *= n--;
	return result;
};
let f_g = (n, m, t) => wmm_cof[n][m].g + (t - wmm_cof[0]) * wmm_cof[n][m].g_dot;
let f_h = (n, m, t) => wmm_cof[n][m].h + (t - wmm_cof[0]) * wmm_cof[n][m].h_dot;
let f_p_n_m_2 = (n, m, u) => {// Формула из  Heiskanen and Moritz, 1967 НО не та что в докумментации к wmm указана а (1 - 62) которая как указано у Heiskanen and Moritz более пригодна для программирования.
	let sum_k_r = 0;
	let r_2 = (n - m) / 2;
	for(let k = 0; k <= r_2; k++)sum_k_r += Math.pow(-1, k) * (factorial(2 * n - 2 * k) / (factorial(k) * factorial(n - k) * factorial(n - m - 2 * k))) * Math.pow(u, n - m - 2 * k);
	return Math.pow(2, -n) * Math.pow((1 - Math.pow(u, 2)), m / 2) * sum_k_r;
};
let f_p_n_m = (n, m, u) => {
	let out_p = 0;
	if(m == 0)out_p = f_p_n_m_2(n, m, u);
	else out_p = Math.sqrt(2 * (factorial(n - m) / factorial(n + m))) * f_p_n_m_2(n, m, u);
	if((2 * (factorial(n - m) / factorial(n + m))) < 0)alert(Math.sqrt(2 * (factorial(n - m) / factorial(n + m))));
	return out_p;
};
let f_x_prime = (t, lambda, fi_prime, r) => {
	let sum_n = 0;
	for(let n = 1; n <= 12; n++){
		let sum_m = 0;
		for(let m = 0; m <= n; m++)sum_m += (f_g(n, m, t) * Math.cos(m * lambda) + f_h(n, m, t) * Math.sin(m * lambda)) * ((n + 1) * Math.tan(fi_prime) * f_p_n_m(n, m, Math.sin(fi_prime)) - Math.sqrt(Math.pow(n + 1, 2) - Math.pow(m, 2)) * (1 / Math.cos(fi_prime)) * f_p_n_m(n + 1, m, Math.sin(fi_prime)));// доделать. с производной.
		sum_n += Math.pow(geomagnetic_a / r, n + 2) * sum_m;
	}
	return -sum_n;
};
let f_y_prime = (t, lambda, fi_prime, r) => {
	let sum_n = 0;
	for(let n = 1; n <= 12; n++){
		let sum_m = 0;
		for(let m = 0; m <= n; m++)sum_m += m * (f_g(n, m, t) * Math.sin(m * lambda) - f_h(n, m, t) * Math.cos(m * lambda)) * f_p_n_m(n, m, Math.sin(fi_prime));
		sum_n += Math.pow(geomagnetic_a / r, n + 2) * sum_m;
	}
	return (1 / Math.cos(fi_prime)) * sum_n;
};
let f_z_prime = (t, lambda, fi_prime, r) => {
	let sum_n = 0;
	for(let n = 1; n <= 12; n++){
		let sum_m = 0;
		for(let m = 0; m <= n; m++)sum_m += (f_g(n, m, t) * Math.cos(m * lambda) + f_h(n, m, t) * Math.sin(m * lambda)) * f_p_n_m(n, m, Math.sin(fi_prime));
		sum_n += (n + 1) * Math.pow(geomagnetic_a / r, n + 2) * sum_m;
	}
	return -sum_n;
};
function compass_angle(c){// Возвращает магнитное склонение в радианах.
	let h = 0;
	let R_c = wmm_A / Math.sqrt(1 - wmm_e_2 * Math.pow(Math.sin(c[1]), 2));
	let p = (R_c + h) * Math.cos(c[1]);
	let z = (R_c * (1 - wmm_e_2) + h) * Math.sin(c[1]);
	let r = Math.sqrt(Math.pow(p, 2) + Math.pow(z, 2));
	let fi_prime = Math.asin(z / r);
	let x_big = f_x_prime(wmm_time, c[0], fi_prime, r) * Math.cos(fi_prime - c[1]) - f_z_prime(wmm_time, c[0], fi_prime, r) * Math.sin(fi_prime - c[1]);
	let y_big = f_y_prime(wmm_time, c[0], fi_prime, r);
	return Math.atan2(y_big, x_big);
}












