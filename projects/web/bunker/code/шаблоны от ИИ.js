function init() {
	// 1. Создаем временный скрытый WebGL холст 64х64
	const gl_canvas = document.createElement('canvas');
	gl_canvas.width = gl_canvas.height = 64;
	const gl = gl_canvas.getContext('webgl');

	if (!gl) return; // Защита, если WebGL не поддерживается

	// 2. Исходный код шейдеров (GLSL)
	// Вертексный шейдер — просто растягивает прямоугольник на весь экран
	const vs_source = `
		attribute vec2 pos;
		void main() { gl_Position = vec4(pos, 0.0, 1.0); }
	`;

	// Фрагментный шейдер — здесь живет вся ТВОЯ ПАРАЛЛЕЛЬНАЯ МАТЕМАТИКА
	// В данном примере — генерация шума для травы
	const fs_source = `
		precision mediump float;
		void main() {
			// Твоя любая сложная математика шейдеров вместо синусов в JS:
			float noise = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
			float g = 0.4 + noise * 0.3; // Вариация зеленого
			gl_FragColor = vec4(0.1, g, 0.1, 1.0); // Записываем RGBA пиксель
		}
	`;

	// 3. Компиляция и сборка шейдерной программы
	const vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vs_source);
	gl.compileShader(vs);

	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fs_source);
	gl.compileShader(fs);

	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.useProgram(program);

	// 4. Передаем геометрию одного прямоугольника (два треугольника, закрывающих экран)
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

	const pos_loc = gl.getAttribLocation(program, 'pos');
	gl.enableVertexAttribArray(pos_loc);
	gl.vertexAttribPointer(pos_loc, 2, gl.FLOAT, false, 0, 0);

	// 5. Видеокарта ПАРАЛЛЕЛЬНО выполняет математику и рисует текстуру
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	// 6. Мгновенно забираем готовый результат из WebGL в наш 2D Canvas паттерн
	// Источником для createImageBitmap может служить сам WebGL Canvas!
	createImageBitmap(gl_canvas).then(bitmap => {
		const flat_pattern = ctx.createPattern(bitmap, 'repeat');
		
		// Запекаем изометрическую матрицу, которую мы утвердили ранее
		const iso_matrix = new DOMMatrix([1, 0, 0, 0.5, 0, 0]);
		flat_pattern.setTransform(iso_matrix);
		
		grass_pattern_iso = flat_pattern; // Наш идеальный паттерн готов к игре!
		bitmap.close();
	});

	// 7. Полная зачистка временных WebGL объектов из памяти
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.deleteBuffer(buffer);
	gl.deleteProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	gl_canvas.remove(); // Удаляем холст из памяти
}
 
