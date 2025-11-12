function Graf_defs(){
	//Создаём градиентную залифку для гор.
	this.mount_gradient = document.createElementNS(svgns, "linearGradient");
	this.mount_gradient.setAttributeNS(null, "id", "gradient_mount");
	this.mount_gradient.setAttributeNS(null, "x2", "0");
	this.mount_gradient.setAttributeNS(null, "y2", "1");
	this.mount_stop_1 = document.createElementNS(svgns, "stop");
	this.mount_stop_1.setAttributeNS(null, "offset", "0%");
	this.mount_stop_1.setAttributeNS(null, "stop-color", "#fff");
	this.mount_gradient.appendChild(this.mount_stop_1);
	this.mount_stop_2 = document.createElementNS(svgns, "stop");
	this.mount_stop_2.setAttributeNS(null, "offset", "30%");
	this.mount_stop_2.setAttributeNS(null, "stop-color", "#05f");
	this.mount_gradient.appendChild(this.mount_stop_2);
	this.mount_stop_3 = document.createElementNS(svgns, "stop");
	this.mount_stop_3.setAttributeNS(null, "offset", "95%");
	this.mount_stop_3.setAttributeNS(null, "stop-opacity", "0");
	this.mount_gradient.appendChild(this.mount_stop_3);
	//Создаём градиентную залифку для леса.
	svg_defs.appendChild(this.mount_gradient);
	this.forest_gradient = document.createElementNS(svgns, "radialGradient");
	this.forest_gradient.setAttributeNS(null, "id", "gradient_forest");
	this.forest_stop_1 = document.createElementNS(svgns, "stop");
	this.forest_stop_1.setAttributeNS(null, "offset", "0%");
	this.forest_stop_1.setAttributeNS(null, "stop-color", "#fff");
	this.forest_gradient.appendChild(this.forest_stop_1);
	this.forest_stop_2 = document.createElementNS(svgns, "stop");
	this.forest_stop_2.setAttributeNS(null, "offset", "30%");
	this.forest_stop_2.setAttributeNS(null, "stop-color", "#043");
	this.forest_gradient.appendChild(this.forest_stop_2);
	this.forest_stop_3 = document.createElementNS(svgns, "stop");
	this.forest_stop_3.setAttributeNS(null, "offset", "95%");
	this.forest_stop_3.setAttributeNS(null, "stop-opacity", "0");
	this.forest_gradient.appendChild(this.forest_stop_3);
	svg_defs.appendChild(this.forest_gradient);
	
}