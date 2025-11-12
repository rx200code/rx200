function Sector(world, id, neighbor, x, y, r){
	this.parent = world;
	
	this.id = id;
	this.x = x;
	this.y = y;
	
	this.childs = [];
	
	if(id != neighbor){
		this.neighbors = [neighbor];
		world.childs[neighbor].add_neighbor(id);
		let path = document.createElementNS(svgns, "path");
		path.setAttributeNS(null, "d", "M"+x+","+y+" L"+world.childs[neighbor].x+","+world.childs[neighbor].y);
		path.setAttributeNS(null, "fill", "none");
		path.setAttributeNS(null, "stroke", "#900");
		path.setAttributeNS(null, "stroke-width", 1);
		svg_roads.appendChild(path);
		
	}else{
		this.neighbors = [];
	}
	
	
	this.graf = document.createElementNS(svgns, "circle");
	this.graf.setAttributeNS(null, "cx", x);
	this.graf.setAttributeNS(null, "cy", y);
	this.graf.setAttributeNS(null, "r", r);
	this.graf.setAttributeNS(null, "fill", "#00a");
	this.graf.setAttributeNS(null, "stroke", "#aa0");
	this.graf.setAttributeNS(null, "stroke-width", 1);
	this.graf.onclick = function(event){
		out("id = "+id+"; neighbors = ["+this.neighbors+"];");
	}.bind(this);
	svg_sectors.appendChild(this.graf);
	
	this.add_neighbor = function(id){
		this.neighbors[this.neighbors.length] = id;
	}
	this.add_child = function(child){
		this.childs[this.childs.length] = child;
		child.parent = this;
		child.set_pos(this.x, this.y);
		svg_city.appendChild(child.picture);
	}
}