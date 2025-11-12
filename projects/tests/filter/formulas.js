Math.cos(((2 * x  + 1) * 0 * Math.PI)/16)
function formula(x){
	let sum = 0;
	let sqrt_2_2_1 = 1 / (2 * Math.sqrt(2));
	for(let u = 0; u < 8; u++){
		let Cu = u ? 0.5: sqrt_2_2_1;
		sum += Cu * Math.cos(((2 * x  + 1) * u * Math.PI)/16);
	}
	return sum;
}
formula(x);
