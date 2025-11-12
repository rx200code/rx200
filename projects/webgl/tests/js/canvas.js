let my_image;
let getImage = url => {
	return new Promise(async resolve => {
		await new Promise(resolve => {
			let img = new Image();
			img.onload = function(){
				my_image = img;
				//img.remove();
				resolve(true);
			};
			img.onerror = () => {
				resolve(true);
			};
			img.crossOrigin = "Anonymous";
			img.src = url;
		});
		resolve(true);
	});
};

window.onload = async function(){
	//alert(canvas.clientWidth);
	//alert(canvas.clientHeight);
	//await getImage("map.jpg");
	await getImage("https://c.tile.openstreetmap.org/0/0/0.png");
	document.body.append(my_image);
	document.body.append(gl.canvas);
	//my_image = document.getElementById("my_image");
	//alert(my_image);
	
	
	let program = createProgram();
	
	//
	//let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	let positionLocation = gl.getAttribLocation(program, "a_position");
	let texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
	//let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	//let colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
	
	let positionBuffer = gl.createBuffer();
	
	
	
	//
	/*
	let positions = [
		0, 0,
		0, 0.5,
		0.7, 0,
	];//*/
	let rect_x = 100;
	let rect_y = 100;
	let rect_w = my_image.width;
	let rect_h = my_image.height;
	let positions = [
		rect_x, rect_y,
		rect_x + rect_w, rect_y,
		rect_x, rect_y + rect_h,
		rect_x, rect_y + rect_h,
		rect_x + rect_w, rect_y,
		rect_x + rect_w, rect_y + rect_h
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	///
	
	//alert(window.devicePixelRatio);// 1
	
	
	let texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0]), gl.STATIC_DRAW);
	
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, my_image);
	
	let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	//gl.clearColor(.5, .5, .5, 1);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.useProgram(program);
	
	//gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(positionLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	
	
	//gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	
	let size = 2;
	let type = gl.FLOAT;
	let normalize = false;
	let stride = 0;
	let offset = 0;
	//gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
	gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
	
	gl.enableVertexAttribArray(texcoordLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	
	
	size = 2;
	type = gl.FLOAT;
	normalize = false;
	stride = 0;
	offset = 0;
	gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
	
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
	
	
	let primitiveType = gl.TRIANGLES;
	offset = 0;
	let count = 6;
	
	//gl.uniform4f(colorUniformLocation, 1, 0, .5, 1);
	gl.drawArrays(primitiveType, offset, count);
	
	
	
	
	/*
  var image = new Image();
  image.src = "map.jpg";  // ДОЛЖНА НАХОДИТЬСЯ НА ТОМ ЖЕ ДОМЕНЕ!!!
  image.onload = function() {
    render(image);
  }

	
	function render(image) {
  // наш код из предыдущего примера
  // ссылка на атрибут, куда пойдут координаты текстуры
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
 
  // указываем координаты текстуры для прямоугольника
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
 
  // создаём текстуру
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
 
  // задаём параметры, чтобы можно было отрисовать изображение любого размера
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
  // загружаем изображение в текстуру
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}//*/
	
	
};




































