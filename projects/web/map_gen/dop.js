// область размещения.
const width = 1000;
const height = 800;
/// rect.
const min_rect_w = 30;
const max_rect_w = 300;
const min_rect_h = 24;
const max_rect_h = 240;

let rect_count = 300;
let rects = [];
function random(min, max){
	return Math.random() * (max - min) + min;
}
for(let i = 0; i < rect_count; i++){
	let c_x = random(0, width);// 0 this.width = 1000
	let c_y = random(0, height);// 0 this.height = 800;
	let w_2 = random(min_rect_w, max_rect_w) / 2;// w 30 300
	let h_2 = random(min_rect_h, max_rect_h) / 2;// h 24 240
	let r = (w_2 ** 2 + h_2 ** 2) ** .5;
	let angle = random(0, Math.PI * 2);// 0 Math.PI * 2; //let angle = 10 * (Math.PI / 180);
	let a = Math.atan2(-h_2, -w_2) + angle;
	let a_cos_r = Math.cos(a) * r;
	let a_sin_r = Math.sin(a) * r;
	let a2 = Math.atan2(-h_2, w_2) + angle;
	let a_cos_r2 = Math.cos(a2) * r;
	let a_sin_r2 = Math.sin(a2) * r;
	
	rects.push([
		c_x + a_cos_r, c_y + a_sin_r,
		c_x + a_cos_r2, c_y + a_sin_r2,
		c_x - a_cos_r, c_y - a_sin_r,
		c_x - a_cos_r2, c_y - a_sin_r2]);
} 


// Код коализей

function test_intersection(rect_main, rect){
	// TEST 0
	if(inPoly(rect_main, rect))return true;
	if(inPoly(rect, rect_main))return true;
	// TEST 1
	for(let i = 0; i < 8; i += 2)for(let k = 0; k < 8; k += 2){
		if(intersection(rect_main[i], rect_main[i + 1], rect_main[(i + 2) % 8], rect_main[(i + 3) % 8], rect[k], rect[k + 1], rect[(k + 2) % 8], rect[(k + 3) % 8]))return true;
	}
	// END TEST 1
	return false;
};

function inPoly(rect_main, rect){
	for(let i = 0; i < 8; i += 2)if(inPoly2(rect_main[i], rect_main[i + 1], rect))return true;
	return false;
}

function inPoly2(x, y, rect){
	let j = rect.length - 2;
	let c = 0;
	for(let i = 0; i < rect.length; i += 2){
		if ((((rect[i + 1] <= y) && (y < rect[j + 1])) || ((rect[j + 1] <= y) && (y < rect[i + 1]))) &&
		(x > (rect[j] - rect[i]) * (y - rect[i + 1]) / (rect[j + 1] - rect[i + 1]) + rect[i])) {
			c = !c
		}
		j = i;
	}
	return c;
}

function intersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2){
	let v1=(bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
	let v2=(bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
	let v3=(ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
	let v4=(ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
	return (v1*v2<0) && (v3*v4<0);
};




function separate_rects(rect_1, rect_2){
	if(!test_intersection(rect_1, rect_2))return;
	// 1. Находим центры.
	let c_x_1 = (rect_1[0] + rect_1[4]) / 2;
	let c_y_1 = (rect_1[1] + rect_1[5]) / 2;
	let c_x_2 = (rect_2[0] + rect_2[4]) / 2;
	let c_y_2 = (rect_2[1] + rect_2[5]) / 2;

	// 2. находим вектор выталкивания.

	let v_x = c_x_1 - c_x_2;
	let v_y = c_y_1 - c_y_2;
	let v_l = (v_x ** 2 + v_y ** 2) ** .5;

	if(v_l === 0){
		v_x = Math.random() - 0.5;
		v_y = Math.random() - 0.5;
		v_l = (v_x ** 2 + v_y ** 2) ** .5;
	}


	// 3. Находим площади.
	let w_1_s = ((rect_1[0] - rect_1[2]) ** 2) + ((rect_1[1] - rect_1[3]) ** 2);
	let h_1_s = ((rect_1[2] - rect_1[4]) ** 2) + ((rect_1[3] - rect_1[5]) ** 2);
	let w_1 = w_1_s ** .5;
	let h_1 = h_1_s ** .5;
	let s_1 = w_1 * h_1;
	let w_2_s = ((rect_2[0] - rect_2[2]) ** 2) + ((rect_2[1] - rect_2[3]) ** 2);
	let h_2_s = ((rect_2[2] - rect_2[4]) ** 2) + ((rect_2[3] - rect_2[5]) ** 2);
	let w_2 = w_2_s ** .5;
	let h_2 = h_2_s ** .5;
	let s_2 = w_2 * h_2;
	let s_total = s_1 + s_2;
	let k_1 = s_2 / s_total;
	let k_2 = 1 - k_1;
	// 4. коректируем вектор выталкивания относительно веса(площади)

	let r_1 = ((w_1_s + h_1_s) ** .5) / 2;
	let r_2 = ((w_2_s + h_2_s) ** .5) / 2;
	let v = r_1 + r_2 - v_l;
	let v_x_n = v_x / v_l;
	let v_y_n = v_y / v_l;
	let v_1 = v * k_1;
	let v_2 = v * k_2;
	let v_x_1 = v_x_n * v_1;
	let v_y_1 = v_y_n * v_1;
	let v_x_2 = v_x_n * v_2;
	let v_y_2 = v_y_n * v_2;

	// 5. Выталкиваем.
	for(let i = 0; i < 8; i += 2){
		rect_1[i] += v_x_1;
		rect_1[i + 1] += v_y_1;
		rect_2[i] -= v_x_2;
		rect_2[i + 1] -= v_y_2;
	}

}