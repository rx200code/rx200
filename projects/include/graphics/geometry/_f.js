// Правильный многоугольник
function regular_polygon(amount_angles = 6, radius = 1){
	let offset_angle = 2 * Math.PI / amount_angles;
	let result = [{x: radius, y: 0}];
	while(amount_angles > 1){
		--amount_angles;
		result.push({x: Math.cos(offset_angle * amount_angles) * radius, y: Math.sin(offset_angle * amount_angles) * radius});
	}
	// for(let i = 1; i < amount_angles; i++)result.push({x: Math.cos(i * a) * radius, y: Math.sin(i * a) * radius});// в другую сторону.
	return result;
}

























