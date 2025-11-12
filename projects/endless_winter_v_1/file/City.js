function City(player){
	this.level = 0;
	this.player = player;
	this.picture = document.createElementNS(svgns, "path");
	this.picture.setAttributeNS(null, "d", "M-10,-10 L0,0 L10,-10 V10 H-10 z");
	this.picture.setAttributeNS(null, "fill", player.color);
	this.picture.setAttributeNS(null, "stroke", "#ff0");
	this.picture.setAttributeNS(null, "stroke-width", 1);
	this.picture.onclick = f_menu_city.bind(this);
	
	this.set_pos = function(x, y){
		this.picture.setAttribute("transform", "translate("+x+", "+y+")");
	}.bind(this);
}