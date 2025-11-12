/// Гео данные
var geode = {
	krasovsky:{a:6378245,b:6356863.018773047,_a:0.003352329869259135,f:298.3,year:1942},
	grs_80:{a:6378137,b:6356752.314140356,_a:0.003352810681182319,f:298.257222101,year:1980},
	wgs_84:{a:6378137,b:6356752.314245179,_a:0.0033528106647474805,f:298.257223563,year:1984},// у параметра _a под вопросом, верныли данные.
	pz_90_11:{a:6378136,b:6356751.361795686,_a:0.0033528037351842955,f:298.25784,year:1990},
	iers:{a:6378136.49,b:6356751.750491433,_a:0.003352819360654229,f:298.25645,year:1996},
	gsk_2011:{a:6378136.5,b:6356751.757955603,_a:0.003352819752979053,f:298.2564151,year:2011}
};
var geo_n = "krasovsky";
/// Далее функции по главам.
/*Введение, для заметок

*/
// Находим сжатие _a

/// Глава I Земной эллипсоид.
// Параграф 1.
function OF1_and_OF2(geode_name = geo_n){// (I.1)
	return Math.sqrt(Math.pow(geode[geode_name].a, 2) - Math.pow(geode[geode_name].b, 2));}
function f_e(geode_name = geo_n){// (I.2) в JavaScript точность, у квадрата (e) на один знак больше, получается путем: return geode[geode_name]._a * (2 - geode[geode_name]._a);
	return Math.sqrt(Math.pow(geode[geode_name].a, 2) - Math.pow(geode[geode_name].b, 2)) / geode[geode_name].a;}
function f_e2(geode_name = geo_n){// в квадрате.
	return geode[geode_name]._a * (2 - geode[geode_name]._a);}
function f_e_2(geode_name = geo_n){// (I.3)
	return Math.sqrt(Math.pow(geode[geode_name].a, 2) - Math.pow(geode[geode_name].b, 2)) / geode[geode_name].b;}
function f_a(geode_name = geo_n){// (I.4) или geode[geode_name]._a
	return (geode[geode_name].a - geode[geode_name].b) / geode[geode_name].a;}
function f_e2_2(geode_name = geo_n){// (I.3) В квадрате.
	return Math.pow(f_e_2(geode_name), 2);}
function f_n(geode_name = geo_n){// (I.5)
	return (geode[geode_name].a - geode[geode_name].b) / (geode[geode_name].a + geode[geode_name].b);}
function f_m(geode_name = geo_n){// (I.6)
	return (Math.pow(geode[geode_name].a, 2) - Math.pow(geode[geode_name].b, 2)) / (Math.pow(geode[geode_name].a, 2) + Math.pow(geode[geode_name].b, 2));}
function f_c(geode_name = geo_n){// (I.7)
	return Math.pow(geode[geode_name].a, 2) / geode[geode_name].b;}
// (I.8 - I.16) Зависимости между величинами эллипсойда I.2 - I.7
function f_geo_xyz(u, L, geode_name = geo_n){// (I.23) Переводит в координаты x, y, z, геодезические коорденаты с приведенной широтой u
	return {x:geode[geode_name].a * Math.cos(u * Math.PI / 180) * Math.cos(L * Math.PI / 180), y:geode[geode_name].a * Math.cos(u * Math.PI / 180) * Math.sin(L * Math.PI / 180), z:geode[geode_name].b * Math.sin(u * Math.PI / 180)};}
function f_xyz_geo(x, y, z, geode_name = geo_n){// (I.24) обратная (I.23)
	let L = Math.atan(y / x);
	return {u:Math.atan((z * Math.sqrt(1 + Math.pow(f_e_2(geode_name), 2))) / (x * Math.cos(L) + y * Math.sin(L))) * 180 / Math.PI, L:L * 180 / Math.PI};}
function f_W(B, geode_name = geo_n){// (I.26)
	return Math.sqrt(1 - f_e_2(geode_name) * Math.pow(Math.sin(B * Math.PI / 180), 2));}
function f_V(B, geode_name = geo_n){// (I.27)
	return Math.sqrt(1 + f_e2_2(geode_name) * Math.pow(Math.cos(B * Math.PI / 180), 2));}
function f_n_(B, geode_name = geo_n){// (I.28)
	return f_e_2(geode_name) * Math.cos(B * Math.PI / 180);}
// Параграф 4.
function f_u_B(u, geode_name = geo_n){// (I.35)
	return Math.atan((geode[geode_name].a / geode[geode_name].b) * Math.tan(u * Math.PI / 180)) * 180 / Math.PI;}
function f_B_u(B, geode_name = geo_n){// (I.37)
	return Math.atan(Math.sqrt(1 - f_e2(geode_name)) * Math.tan(B * Math.PI / 180)) * 180 / Math.PI;}
// глава 4, параграф 26. Прямая геодезическая задача на шаре.
function f_faq_in_f2(f, a, q, geode_name = geo_n){// (IV.17)
	f = deg_in_rad(f);
	a = deg_in_rad(a);
	q = q / ((geode[geode_name].a + geode[geode_name].b) / 2);// Длина дуги выраженная в частях радиуса шара.
	return rad_in_deg(Math.asin(Math.sin(f) * Math.cos(q) + Math.cos(f) * Math.sin(q) * Math.cos(a)));// (IV.17)
}
function f_faq_in_l(f, a, q, geode_name = geo_n){// (IV.19)
	f = deg_in_rad(f);
	a = deg_in_rad(a);
	q = q / ((geode[geode_name].a + geode[geode_name].b) / 2);// Длина дуги выраженная в частях радиуса шара.
	return rad_in_deg(Math.atan((Math.sin(q) * Math.sin(a)) / (Math.cos(f) * Math.cos(q) - Math.sin(f) * Math.sin(q) * Math.cos(a))));// (IV.19)
}
function f_faq_in_a2(f, a, q, geode_name = geo_n){// (IV.20)
	f = deg_in_rad(f);
	a = deg_in_rad(a);
	q = q / ((geode[geode_name].a + geode[geode_name].b) / 2);// Длина дуги выраженная в частях радиуса шара.
	return rad_in_deg(Math.atan((Math.cos(f) * Math.sin(a)) / (Math.cos(f) * Math.cos(q) * Math.cos(a) - Math.sin(f) * Math.sin(q))));// (IV.20)
}
// глава 4, параграф 26. Обратная геодезическая задача на шаре.
function f_ffl_in_a1(f1, f2, l){// (IV.21)
	f1 = deg_in_rad(f1);
	f2 = deg_in_rad(f2);
	l = deg_in_rad(l);
	return rad_in_deg(Math.atan((Math.sin(l) * Math.cos(f2)) / (Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(l))));// (IV.21)
}
function f_ffl_in_a2(f1, f2, l){// (IV.22)
	f1 = deg_in_rad(f1);
	f2 = deg_in_rad(f2);
	l = deg_in_rad(l);
	return rad_in_deg(Math.atan((Math.sin(l) * Math.cos(f1)) / (Math.cos(f1) * Math.sin(f2) * Math.cos(l) - Math.sin(f1) * Math.cos(f2))));// (IV.22)
}
function f_ffl_in_q(f1, f2, l,  geode_name = geo_n){// (IV.23)
	a1 = deg_in_rad(f_ffl_in_a1(f1, f2, l));
	f1 = deg_in_rad(f1);
	f2 = deg_in_rad(f2);
	l = deg_in_rad(l);
	return Math.atan((Math.cos(f2) * Math.sin(l) * Math.sin(a1) + (Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(l)) * Math.cos(a1)) / (Math.sin(f1) * Math.sin(f2) + Math.cos(f1) * Math.cos(f2) * Math.cos(l))) * ((geode[geode_name].a + geode[geode_name].b) / 2);// (IV.23)
}

// Для тестов Гаусса-Крюгера WGS 84
function f_wgs84_in_gauss_kruger(L_deg, B_deg){
	//* для тестов.
	B_deg = 45;
	//L_deg = 9;
	let a = 6378245;// krasovsky
	let b = 6356863.0188;// krasovsky 6356863.018773047 */
	/*
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
	
	//let l = Math.abs(L_1) * Math.PI / 180;// B_deg в радианах.
	
	let l = 9 * Math.PI / 180;;// для тестов.
	// (VI.20)
	let x = X + a_2 * Math.pow(l, 2) + a_4 * Math.pow(l, 4) + a_6 * Math.pow(l, 6) + a_8 * Math.pow(l, 8);
	let y = b_1 * l + b_3 * Math.pow(l, 3) + b_5 * Math.pow(l, 5) + b_7 * Math.pow(l, 7);
	
	return {x:x, y:y};
}
function f_wgs84_in_gauss_kruger_TEST(L_deg, B_deg){
	//* для тестов.
	B_deg = 45;
	//L_deg = 9;
	let a = 6378245;// krasovsky
	let b = 6356863.0188;// krasovsky 6356863.018773047 */
	/*
	let a = 6378137;// WGS 84
	let b = 6356752.314245179;// WGS 84 */
	let _a = (a - b) / a;// (I.4)
	
	let B = B_deg * Math.PI / 180;// B_deg в радианах.
	
	let e2 = _a * (2 - _a);// e в квадрате или (I.2) в квадрате. в JavaScript точность, у квадрата (e) на один знак больше, получается путем: _a * (2 - _a);
	let N = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(B), 2));// (I.60)
	let e_2 = Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2)) / b;// (I.3)
	let _n = e_2 * Math.cos(B);// (I.28)
	// (VI.21)
	let a_2 = .5 * N * Math.sin(B) * Math.cos(B);
	let a_4 = (1 / 24) * N * Math.sin(B) * Math.pow(Math.cos(B), 3) * (5 - Math.pow(Math.tan(B), 2) + 9 * Math.pow(_n, 2) + 4 * Math.pow(_n, 4));
	let a_6 = (1 / 720) * N * Math.sin(B) * Math.pow(Math.cos(B), 5) * (61 - 58 * Math.pow(Math.tan(B), 2) + Math.pow(Math.tan(B), 4) + 270 * Math.pow(_n, 2) - 330 * Math.pow(_n, 2) * Math.pow(Math.tan(B), 2));
	let a_8 = (1 / 40320) * N * Math.sin(B) * Math.pow(Math.cos(B), 7) * (1385 - 3111 * Math.pow(Math.tan(B), 2) + 543 * Math.pow(Math.tan(B), 4) - Math.pow(Math.tan(B), 6));
	
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
	
	//let l = Math.abs(L_1) * Math.PI / 180;// B_deg в радианах.
	
	let l = 9 * Math.PI / 180;// для тестов.
	// (VI.20)
	let x = X + a_2 * Math.pow(l, 2) + a_4 * Math.pow(l, 4) + a_6 * Math.pow(l, 6) + a_8 * Math.pow(l, 8);
	
	
	let l2 = Math.pow(l, 2);
	let _N = ((0.605 * Math.pow(Math.sin(B), 2) + 107.155) * Math.pow(Math.sin(B), 2) + 21346.142) * Math.pow(Math.sin(B), 2) + 6378245;
	let b_13 = (0.00112309 * Math.pow(Math.cos(B), 2) + 0.33333333) * Math.pow(Math.cos(B), 2) - 0.16666667;
	let b_15 = ((0.004043 * Math.pow(Math.cos(B), 2) + 0.196743) * Math.pow(Math.cos(B), 2) - 0.166667) * Math.pow(Math.cos(B), 2) + 0.008333;
	let b_17 = ((0.1429 * Math.pow(Math.cos(B), 2) - 0.1667) * Math.pow(Math.cos(B), 2) + 0.0361) * Math.pow(Math.cos(B), 2) - 0.0002;
	
	let y = (((b_17 * l2 + b_15) * l2 + b_13) * l2 + 1) * l * _N * Math.cos(B);
	
	return {x:x, y:y};
}
// Уравнения множественной регрессии
function f_multi_regression_equations(L, F, geode_name_A, geode_name_B){
	
	
	return "Не риализовано пока";
}

///Вспомогательные
function deg_in_rad(deg){
	return deg * Math.PI / 180;}
function rad_in_deg(rad){
	return rad / Math.PI * 180;}
// данные для тестов.
var coor_a = {lat:55,lng:83};
var coor_b = {lat:55,lng:84};
function test(){
	//alert(Math.atan(Math.tan(0.5)));
	geo_n = "krasovsky";
	let text = "Геод: <b>"+geo_n+"</b><br>";
	text += "F1 = F2 = "+OF1_and_OF2()+" (I.1)<br>";
	text += "эксцентриситет e = "+f_e()+" (I.2)<br>";
	text += "второй эксцентриситет e = "+f_e_2()+" (I.3)<br>";
	text += "сжатие _a = "+f_a()+" (I.4)<br>";
	text += "n = "+f_n()+" (I.5)<br>";
	text += "m = "+f_m()+" (I.6)<br>";
	text += "c = "+f_c()+" (I.7)<br>";
	let cor = {u:55, L:83};
	text += "<b>Возьмем координаты L = "+cor.L+", u = "+cor.u+"</b><br>";
	let cor_xyz = f_geo_xyz(cor.u, cor.L);
	text += "Переведем их в в декартовы координаты x = "+cor_xyz.x+", y = "+cor_xyz.y+", z = "+cor_xyz.z+" (I.23)<br>";
	let cor_uL = f_xyz_geo(cor_xyz.x, cor_xyz.y, cor_xyz.z);
	text += "и обратно L = "+cor_uL.L+", u = "+cor_uL.u+" (I.24)<br>";
	cor.B = f_u_B(cor.u);
	
	text += "B = "+cor.B+" (I.35)<br>";
	text += "и обратно u = "+f_B_u(cor.B)+" (I.37)<br>";
	// глава 4, параграф 26.
	text += "<b>Прямая геодезическая задача на шаре</b><br>";
	//let o_flaq = {f:55, l:83, a:45, q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	let o_flaq = {f:55, l:83, a:45, q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "<b>Широта: "+o_flaq.f+", Долгота: "+o_flaq.l+", Азимут: "+o_flaq.a+"°, Расстояние: "+o_flaq.q+"(м), Радиус шара: "+o_flaq.r+"(м).</b><br>";
	
	let o_flaq_2 = {f:f_faq_in_f2(o_flaq.f, o_flaq.a, o_flaq.q), l:f_faq_in_l(o_flaq.f, o_flaq.a, o_flaq.q) + o_flaq.l, a:f_faq_in_a2(o_flaq.f, o_flaq.a, o_flaq.q) - 180, q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "Результат: Широта: "+o_flaq_2.f+", Долгота: "+o_flaq_2.l+", обратный азимут: "+o_flaq_2.a+". (IV.17,19,20)<br>";
	
	let o_flaq_3 = {f:f_faq_in_f2(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q), l:f_faq_in_l(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q) + o_flaq_2.l, a:f_faq_in_a2(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q), q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "Результат 2: Широта: "+o_flaq_3.f+", Долгота: "+o_flaq_3.l+", обратный азимут: "+o_flaq_3.a+". (IV.17,19,20)<br>";
	text += "<b>Обратная геодезическая задача на шаре</b><br>";
	
	text += "Расстояние между ранее найденнвми точками: "+f_ffl_in_q(o_flaq.f, o_flaq_2.f, o_flaq_2.l - o_flaq.l)+"(м). (IV.23)<br>";
	
	// ДОП.
	text += "<br>";
	text += "<b>доп.</b> n_ = "+(f_n_(cor.B) * 60 * 60)+" секунд. (I.28)<br>";
	text += "<b>доп. test</b> n = "+(346.3143 / 60 / 60)+" test.<br>";
	
	text += "<br>";
	let m_0 = geode[geo_n].a * (1 - f_e2());
	let m_2 = 3 / 2 * f_e2() * m_0;
	let m_4 = 5 / 4 * f_e2() * m_2;
	let m_6 = 7 / 6 * f_e2() * m_4;
	let m_8 = 9 / 8 * f_e2() * m_6;
	let m_10 = 11 / 10 * f_e2() * m_8;
	
	text += "m_0 = "+m_0+" (I.65)<br>";
	text += "m_2 = "+m_2+" (I.65)<br>";
	text += "m_4 = "+m_4+" (I.65)<br>";
	text += "m_6 = "+m_6+" (I.65)<br>";
	text += "m_8 = "+m_8+" (I.65)<br>";
	text += "m_10 = "+m_10+" (I.65)<br>";
	
	text += "<br>";
	let a_0 = m_0 + (m_2 / 2) + ((3 / 8) * m_4) + ((5 / 16) * m_6) + ((35 / 128) * m_8);
	let a_2 = (m_2 / 2) + (m_4 / 2) + ((15 / 32) * m_6) + ((7 / 16) * m_8);
	let a_4 = (m_4 / 8) + ((3 / 16) * m_6) + ((7 / 32) * m_8);
	
	text += "a_0 = "+a_0+"<br>";
	text += "a_2 = "+a_2+"<br>";
	text += "a_4 = "+a_4+"<br>";
	text += "<br>";
	text += "m_0 - (m_8 / 128) = "+(m_0 - (m_8 / 128))+"<br>";
	text += "m_6 + (m_8 * 2) = <b>"+(m_6 + (m_8 * 2))+"</b><br>";
	
	let wgs_84_L = 83;
	let wgs_84_B = 55;
	text += "<b>Вычислим координаты Гаусса-Крюгера, для геодезических L = "+wgs_84_L+", и B = "+wgs_84_B+".</b><br>";
	let obj_xy = f_wgs84_in_gauss_kruger(wgs_84_L, wgs_84_B);
	text += "x = "+obj_xy.x+"<br>y = "+obj_xy.y+"<br>";
	text += "<b>Уравнения множественной регрессии</b><br>";
	text += "L = 83, F = 55";
	text += "f_multi_regression_equations(L, F, geode_name_A, geode_name_B)<br>";
	text += "out f_multi_regression_equations(83, 55, 'wgs_84', 'krasovsky') = "+f_multi_regression_equations(83, 55, 'wgs_84', 'krasovsky')+"<br>";
	
	out(text);
}
function out(text){
	document.getElementById("output").innerHTML=text;
}
function info(text){
	document.getElementById("info").innerHTML=text;
}
function test_2(){
	let text = "";
	
	
	let xyz = f_geo_xyz(43, 13);
	let uL = f_xyz_geo(xyz.x, xyz.y, xyz.z);
	
	out(JSON.stringify(uL));
	
	/*
	for(let i = 0; i < arr.length; i++)
	for(var i in obj)
	JSON.stringify(
	*/
}