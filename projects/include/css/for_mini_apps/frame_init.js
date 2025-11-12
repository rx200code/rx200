
function frame_init(elm_id){
	const min_size_elm = 10;
	const border_size_elm = min_size_elm / 2;
	let elm = document.getElementById(elm_id);
	elm.style.zIndex = "2000";
	
	let rect = elm.getBoundingClientRect();
	let cursor = "auto";
	let flag_left = false;
	let flag_top = false;
	let flag_width = true;
	let flag_height = true;
	elm.onmousedown = e => {
		if(e.clientX < rect.left + border_size_elm){
			flag_left = true;
		}else if(e.clientX > rect.right - border_size_elm){
			flag_left = false;
		}else flag_width = false;
		
		if(e.clientY < rect.top + border_size_elm){
			flag_top = true
		}else if(e.clientY > rect.bottom - border_size_elm){
			flag_top = false
		}else flag_height = false;
		
		let shiftX = flag_left ? rect.left: rect.right;
		let width = rect.width;
		let shiftY = flag_top ? rect.top: rect.bottom;
		let height = rect.height;
		//*
		onMouseMove = event => {
			if(flag_width){
				if(flag_left)width += shiftX - event.clientX;
				else width -= shiftX - event.clientX;
				if(width < min_size_elm)width = min_size_elm;
				let left = flag_left ? event.clientX: event.clientX - width;
				elm.style.left = left + "px";
				elm.style.width = width + "px";
				shiftX = event.clientX;
			}
			if(flag_height){
				if(flag_top)height += shiftY - event.clientY;
				else height -= shiftY - event.clientY;
				if(height < min_size_elm)height = min_size_elm;
				let top = flag_top ? event.clientY: event.clientY - height;
				elm.style.top = top + "px";
				elm.style.height = height + "px";
				shiftY = event.clientY;
			}
			out(width + ", " + height);
		}
		if(flag_width || flag_height)document.onselectstart = () => false;
		document.addEventListener("mousemove", onMouseMove);
		document.onmouseup = () => {
			rect = elm.getBoundingClientRect();
			document.removeEventListener("mousemove", onMouseMove);
			document.onmouseup = null;
			document.onselectstart = null;
			flag_width = true;
			flag_height = true;
			
		};
		
		//out("d");
	};
	elm.onmousemove = e => {
		
		if(e.clientX < rect.left + border_size_elm){
			if(e.clientY < rect.top + border_size_elm){
				cursor = "nwse-resize";
			}else if(e.clientY > rect.bottom - border_size_elm){
				cursor = "nesw-resize";
			}else cursor = "ew-resize";
		}else if(e.clientX > rect.right - border_size_elm){
			if(e.clientY < rect.top + border_size_elm){
				cursor = "nesw-resize";
			}else if(e.clientY > rect.bottom - border_size_elm){
				cursor = "nwse-resize";
			}else cursor = "ew-resize";
		}else if(e.clientY < rect.top + border_size_elm){
			cursor = "ns-resize";
		}else if(e.clientY > rect.bottom - border_size_elm){
			cursor = "ns-resize";
		}else{
			cursor = "auto";
		}
		elm.style.cursor = cursor;
		//out(e.clientY + ", " + e.clientX);
	};
}
































