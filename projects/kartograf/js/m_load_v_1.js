function M_load(){
	let menu = document.getElementById("content_load");// Меню загрузок.
	
	let b_load = document.getElementById("map_load");
	let b_save = document.getElementById("map_save");
	b_load.onclick = () => {
		alert("Загрузить");
	};
	b_save.onclick = () => {
		alert("Сохранить");
	};
	
	let canvas = document.getElementById("canvas_test");
	let ctx = canvas.getContext('2d');
	let b_load_test = document.getElementById("load_test");
	
	let image = new Image(60, 45);
	//image.onload = () => {alert("imag")};
	image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
	let count = 0;
	b_load_test.onclick = () => {
		let size = map.map.getSize();
		//canvas.style.width = size[0]+"px";
		canvas.setAttribute("width", size[0]);
		//canvas.style.height = size[1]+"px";
		canvas.setAttribute("height", size[1]);
		let arr = document.querySelectorAll('.ol-layer canvas');
		
		let elm_imag = map.map.getViewport();
		
		map.base_layer.once('postrender', e => {
			//e.context.fillStyle = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(1,7)+"ff";
			//e.context.fillRect(0, 0, 500, 500);
			//alert(e.context.canvas.style.transform);
			//ctx.drawImage(e.context.canvas, 10, 10, 100, 100, 10, 10, 100, 100);
			ctx.drawImage(e.context.canvas, 0, 0, size[0], size[1], 0, 0, size[0], size[1]);
			//let imag = canvas.toDataURL('image/jpeg');
			//*
			e.context.canvas.toBlob(function(file){
				let a = document.createElement("a"),
				url = URL.createObjectURL(file);
				a.href = url;
				a.download = "map.png";
				document.body.appendChild(a);
				a.click();
				setTimeout(() => {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 0); 
			}, "image/png");
			//*/
			//download(e.context.getImageData(60, 60, 200, 100), "map.png", "image/png");
			//download(ctx.getImageData(60, 60, 200, 100), "map.png", "image/png");
			//let src = e.context.canvas.toDataURL("image/png");
			//let img = document.createElement('img');// create a Image Element
			//img.src = src;//image source
			//ctx.drawImage(img, 0, 0);
			//let img = e.context.getImageData(0, 0, 100, 100);
			//ctx.drawImage(img, 0, 0);
			//alert(e.context.getImageData(0, 0, 200, 200));
			//ctx.drawImage(e.context.getImageData(0, 0, 200, 200), 0, 0);
		});
		
		
		//map.map.once('rendercomplete', () => {alert(document.querySelectorAll('.ol-layer canvas').length);})
		
		//alert(arr.length);
		ctx.clearRect(0, 0, 500, 500);
		ctx.fillStyle = '#'+(0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(1,7)+"ff";
		ctx.fillRect(0, 0, 500, 500);
		if(count & 1){
			/*
			Array.prototype.forEach.call(
				document.querySelectorAll('.ol-layer canvas'),
				function (canvas_1) {
					if (canvas_1.width > 0) {
						var opacity = canvas_1.parentNode.style.opacity;
						ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);
						var transform = canvas_1.style.transform;
						// Get the transform parameters from the style's transform matrix
						var matrix = transform
							.match(/^matrix\(([^\(]*)\)$/)[1]
							.split(',')
							.map(Number);
						// Apply the transform to the export map context
						CanvasRenderingContext2D.prototype.setTransform.apply(
							ctx,
							matrix
						);
						ctx.drawImage(canvas_1, 0, 0);
					}
				}
			);
			let imag = canvas.toDataURL('image/jpeg');
			//*/
			
			//ctx.drawImage(elm_imag, 0, 0);
			//ctx.drawImage(arr[0], 0, 0, size[0], size[1], 0, 0, size[0], size[1]);
			//let img = canvas.toDataURL('image/jpeg');
		}else{
			ctx.drawImage(image, 0, 0, 200, 100);
			/*
			map.map.once('rendercomplete', function (){
				let format = "a4";
				var dims = {
					a0: [1189, 841],
					a1: [841, 594],
					a2: [594, 420],
					a3: [420, 297],
					a4: [297, 210],
					a5: [210, 148],
				};
				var dim = dims[format];
				var mapCanvas = document.createElement('canvas');
				mapCanvas.width = size[0];
				mapCanvas.height = size[1];
				var mapContext = mapCanvas.getContext('2d');
				Array.prototype.forEach.call(
					document.querySelectorAll('.ol-layer canvas'),
					function (canvas) {
						if (canvas.width > 0) {
							var opacity = canvas.parentNode.style.opacity;
							mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
							var transform = canvas.style.transform;
							// Get the transform parameters from the style's transform matrix
							var matrix = transform
								.match(/^matrix\(([^\(]*)\)$/)[1]
								.split(',')
								.map(Number);
							// Apply the transform to the export map context
							CanvasRenderingContext2D.prototype.setTransform.apply(
								mapContext,
								matrix
							);
							mapContext.drawImage(canvas, 0, 0);
						}
					}
				);
				var pdf = new jsPDF('landscape', undefined, format);
				pdf.addImage(
					mapCanvas.toDataURL('image/jpeg'),
					'JPEG',
					0,
					0,
					dim[0],
					dim[1]
				);
				pdf.save('map.pdf');
				// Reset original map size
		});//*/
		}
		count++;
	};
	
};