/// ФУНКЦИИ И ПАРАМЕТРЫ смены систем/проекций координат.

// Дол. параметры.
const rad_90 = Math.PI / 2;
const rad_360 = Math.PI * 2;
// Дол. функции.
let d_360 = d => (d %= 360) < 0 ? d + 360: d;
let r_360 = r => (r %= rad_360) < 0 ? r + rad_360: r;
let toRad = deg => deg * Math.PI / 180;
let toDeg = rad => rad / Math.PI * 180;
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
/// WGS 84
let to_wgs_84 = c => [c[0] / crs.ell.wgs_84.a, rad_90 - 2 * Math.atan(Math.E ** (-c[1] / crs.ell.wgs_84.a))];// EPSG:1024
let from_wgs_84 = c => {// EPSG:1024
	let x = Math.tan(c[1]);
	return [c[0] * crs.ell.wgs_84.a, Math.log(x + (x * x + 1) ** .5) * crs.ell.wgs_84.a];
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
let f_z_GK = axis => ((rad_6 + r_360(axis)) / rad_6) | 0;
let f_z_UTM = axis => f_z_GK(axis + Math.PI);
let f_axis = l => {
	let axis = (l - l % rad_6) + rad_3;
	if(l < 0)axis -= rad_6;
	return axis;
};
// Настройки для функций UTM.
function UTM_options(FE_z, FN, k_0, ell, to_c, from_c, f_z){
	this.FE = 500000;
	this.FE_z = FE_z;
	this.f_z = f_z;
	this.FN = FN;
	this.k_0 = k_0;
	this.e = ell.e;
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

let to_UTM_JHS = (c, op) => {//EPSG:9807, 9824(определяет уникальность координат в каждой зоне)
	let c_to = op.to_c(c);
	let s = c_to[1] < 0;
	if(c.length > 2)s = c[3];
	let l_0 = c.length > 2 ? c[2]:f_axis(c_to[0]);
	let _B = Math.atan(Math.sinh(Math.asinh(Math.tan(c_to[1])) - (op.e * Math.atanh(op.e * Math.sin(c_to[1])))));
	let n_0 = Math.atanh(Math.cos(_B) * Math.sin(c_to[0] - l_0));
	let W_0 =  Math.asin(Math.sin(_B) * Math.cosh(n_0));
	return [op.FE + op.f_z(l_0) * op.FE_z + op.k_0 * op.B * (n_0 + op.h_1 * Math.cos(2 * W_0) * Math.sinh(2 * n_0) + op.h_2 * Math.cos(4 * W_0) * Math.sinh(4 * n_0) + op.h_3 * Math.cos(6 * W_0) * Math.sinh(6 * n_0) + op.h_4 * Math.cos(8 * W_0) * Math.sinh(8 * n_0)), (s ? op.FN: 0) + op.k_0 * (op.B * (W_0 + op.h_1 * Math.sin(2 * W_0) * Math.cosh(2 * n_0) + op.h_2 * Math.sin(4 * W_0) * Math.cosh(4 * n_0) + op.h_3 * Math.sin(6 * W_0) * Math.cosh(6 * n_0) + op.h_4 * Math.sin(8 * W_0) * Math.cosh(8 * n_0))), l_0, s];
};
let from_UTM_JHS = (c, op) => {//EPSG:9807, 9824
	let _n = (c[0] - (op.FE + op.f_z(c[2]) * op.FE_z)) / (op.B * op.k_0);
	let W = (c[1] - (c[3] ? op.FN: 0)) / (op.B * op.k_0);
	let n_0 = _n - (op._h_1 * Math.cos(2 * W) * Math.sinh(2 * _n) + op._h_2 * Math.cos(4 * W) * Math.sinh(4 * _n) + op._h_3 * Math.cos(6 * W) * Math.sinh(6 * _n) + op._h_4 * Math.cos(8 * W) * Math.sinh(8 * _n));
	let _B = Math.asin(Math.sin(W - (op._h_1 * Math.sin(2 * W) * Math.cosh(2 * _n) + op._h_2 * Math.sin(4 * W) * Math.cosh(4 * _n) + op._h_3 * Math.sin(6 * W) * Math.cosh(6 * _n) + op._h_4 * Math.sin(8 * W) * Math.cosh(8 * _n))) / Math.cosh(n_0));
	let Q_1 = Math.asinh(Math.tan(_B));
	let Q_2 = Q_1 + (op.e * Math.atanh(op.e * Math.tanh(Q_1)));
	for(let i = 0; i < 6; i++)Q_2 = Q_1 + (op.e * Math.atanh(op.e * Math.tanh(Q_2)));
	return op.from_c([c[2] + Math.asin(Math.tanh(n_0) / Math.cos(_B)), Math.atan(Math.sinh(Q_2))]);
};
let to_UTM = c => to_UTM_JHS(c, crs.utm_op.UTM);
let from_UTM = c => from_UTM_JHS(c, crs.utm_op.UTM);
let to_UTM_GK = c => to_UTM_JHS(c, crs.utm_op.GK);
let from_UTM_GK = c => from_UTM_JHS(c, crs.utm_op.GK);

/// ############## Системы координат, проекции ##############
crs.sc = [
	{// EPSG 4326
		name:"WGS 84",
		title:"",
		f_to:to_wgs_84,
		f_from:from_wgs_84
	},
	{// EPSG 4326 / 32600(32601 - 32660) - 32700(32701 - 32760), 16000(16001-16060) - 16100(16101-16160)
		name:"WGS 84 / UTM",
		title:"",
		f_to:to_UTM,
		f_from:from_UTM,
		f_z:f_z_UTM,
		metre:true,
		zone:true
	},
	{// EPSG 4284-5044
		name:"Pulkovo 1942",
		title:"",
		f_to:to_sk_42,
		f_from:from_sk_42
	},
	{// EPSG 4284 / 28402 - 28432
		name:"Pulkovo 1942 / Gauss-Kruger",
		title:"",
		f_to:to_UTM_GK,
		f_from:from_UTM_GK,
		f_z:f_z_GK,
		metre:true,
		zone:true
	},
	{// EPSG 3857
		name:"Web Mercator",// Название
		title:"",// Описание
		f_to:c => c,// Перевод из Web Mercator, в данную проекцию, если угловые координаты то в радианы.
		f_from:c => c,// перевод из данной проекции в Web Mercator, если угловые координаты то принимает в радианах.
		metre:true// Угловая или метрическая система. Можно оставить не определенный как undefined
	}
];

/// Методы доступа.
crs.get_crs = name => crs.sc.find(elm => elm.name == name);
crs.to_f = name => crs.get_crs(name).f_to;// Возвращает функцию, для преобразования координат.
crs.from_f = name => crs.get_crs(name).f_from;
/// #######################################



































