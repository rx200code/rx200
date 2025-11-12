var Pro_Filters = function(){
	//##########Оснавное, настройки.##########
	//Пространство имен SVG.
	let svgns = "http://www.w3.org/2000/svg";
	//Расположение программы.
	this.span = document.getElementById("pro_filters");
	this.span.style.cssText = "margin: 0; padding: 0;";
	//Омновное окно.
	this.svg = document.createElementNS(svgns, "svg");
	this.svg.setAttributeNS(null, "width", "1000");
	this.svg.setAttributeNS(null, "height", "800");
	this.svg.style.cssText = "background-color: #008;";
	this.span.appendChild(this.svg);
	
	/*/##### TEST #####
	this.tt = document.createElement("table");
	this.tt.innerHTML = "<tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr>";
	this.tt.style.cssText = "background-color: #888; position: absolute; left: 500px; top: 400px;";
	this.span.appendChild(this.tt);
	//### END TEST ###*/
}

var go = new Pro_Filters();
