function Grid(){
	this.svg = document.getElementById("svg");// слой для рисования.
	let input_mc = document.getElementById("markings_corners");
	input_mc.checked = false;
	// TEST
	//this.svg.style.cssText = "position: absolute;";
	/*
	let t_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	t_circle.setAttributeNS(null, "cx", "40");
	t_circle.setAttributeNS(null, "cy", "40");
	t_circle.setAttributeNS(null, "r", "40");
	t_circle.setAttributeNS(null, "fill", "#000");
	t_circle.style.pointerEvents = "visible";
	//t_circle.setAttributeNS(null, "stroke", "#000");
	//t_circle.setAttributeNS(null, "pointer-events", "none");
	this.svg.appendChild(t_circle);
	//*/
}