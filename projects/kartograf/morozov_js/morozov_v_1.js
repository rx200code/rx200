/// Гео данные
var geode = {
	krasovsky:{a:6378245,b:6356863.018773047,_a:0.003352329869259135,f:298.3,year:1942},
	grs_80:{a:6378137,b:6356752.314140356,_a:0.003352810681182319,f:298.257222101,year:1980},
	wgs_84:{a:6378137,b:6356752.314245179,_a:0.0033528106647474805,f:298.257223563,year:1984},
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
	let o_flaq = {f:55, l:83, a:45, q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "<b>Широта: "+o_flaq.f+", Долгота: "+o_flaq.l+", Азимут: "+o_flaq.a+"°, Расстояние: "+o_flaq.q+"(м), Радиус шара: "+o_flaq.r+"(м).</b><br>";
	
	let o_flaq_2 = {f:f_faq_in_f2(o_flaq.f, o_flaq.a, o_flaq.q), l:f_faq_in_l(o_flaq.f, o_flaq.a, o_flaq.q) + o_flaq.l, a:f_faq_in_a2(o_flaq.f, o_flaq.a, o_flaq.q) - 180, q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "Результат: Широта: "+o_flaq_2.f+", Долгота: "+o_flaq_2.l+", обратный азимут: "+o_flaq_2.a+". (IV.17,19,20)<br>";
	
	let o_flaq_3 = {f:f_faq_in_f2(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q), l:f_faq_in_l(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q) + o_flaq_2.l, a:f_faq_in_a2(o_flaq_2.f, o_flaq_2.a, o_flaq_2.q), q:200000, r:(geode[geo_n].a + geode[geo_n].b) / 2};
	text += "Результат 2: Широта: "+o_flaq_3.f+", Долгота: "+o_flaq_3.l+", обратный азимут: "+o_flaq_3.a+". (IV.17,19,20)<br>";
	text += "<b>Обратная геодезическая задача на шаре</b><br>";
	
	text += "Расстояние между ранее найденнвми точками: "+f_ffl_in_q(o_flaq.f, o_flaq_2.f, o_flaq_2.l - o_flaq.l)+"(м). (IV.23)<br>";
	
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