var attr = {};
attr.a_osm = '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
attr.t_osm = '© '+attr.a_osm+' contributors';
attr.by_3 = '<a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC-BY</a>';
attr.by_sa_2 = '<a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
attr.by_sa_3 = '<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>';
attr.osm = attr.t_osm+', '+attr.by_sa_2;
attr.wmflabs = attr.t_osm+', <a href="https://tiles.wmflabs.org/" target="_blank">wmflabs</a>';
attr.a_fr = '<a href="http://www.openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
attr.stamen = '<a href="http://maps.stamen.com/" target="_blank">Map tiles</a> by <a href="http://stamen.com" target="_blank">Stamen Design</a>, under '+attr.by_3+'. Data by <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>, '+attr.t_osm+', under '+attr.by_sa_3;
attr.esri = '© <a href="https://www.esri.com/" target="_blank">Esri</a>, <a href="https://www.esri-cis.ru/" target="_blank">Esri CIS</a>, <a href="https://www.esri-cis.ru/" target="_blank">ArcGIS CIS</a>.';
attr.kartogiraffe = attr.t_osm+' | <a href="https://www.kartogiraffe.de/?page=impressum" target="_blank">Impressum / Imprint</a>';
attr.mapbox = '© <a href="https://www.mapbox.com/" target="_blank">MapBox</a>';
attr.mapy = '<a href="https://mapy.cz/" target="_blank"><img src="https://en.mapy.cz/img/favicon/favicon.ico" height="9"> Mapy cz</a>, © <a href="https://www.seznam.cz" target="_blank">Seznam.cz, a.s.</a>, '+attr.t_osm;
attr.rel = attr.t_osm+', <a href="https://maps-for-free.com/" target="_blank">Relief Map</a>';
let u_kartogiraffe = [
	'https://tiles.kartogiraffe.de/tiles/tile.php?zoom={z}&x={x}&y={y}',
	'https://tales.kartogiraffe.de/tiles/tile.php?zoom={z}&x={x}&y={y}',
	'https://tules.kartogiraffe.de/tiles/tile.php?zoom={z}&x={x}&y={y}'
];
var g_tiles = [
{
	name:'default',
	type:0,// 0 - простой, 1 - топо, 2 - снимки, 3 - зима, 4 - информативный, 5 - нестабильный, 6 - сломанный который не надо отображать.
	url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	s:'a-c',
	max_z:19,
	min_z:0,
	attr:attr.osm
},
{
	name:'OpenStreetMap (OSM)',
},
{
	name:'OpenTopoMap (OSM)',
	type:1,
	url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
	max_z:17,// то 16 то 15,
	min_z:1,
	attr:'Kartendaten: © '+attr.a_osm+'-Mitwirkende, SRTM | Kartendarstellung: © <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> ('+attr.by_sa_3+'), <a href="https://opentopomap.org/about#legende" target="_blank">legende</a>'
},
{
	name:'OpenStreetMap (wmflabs)',
	url:'https://tiles.wmflabs.org/osm/{z}/{x}/{y}.png',
	max_z:20,
	attr:attr.wmflabs
},
{
	name:'OpenStreetMap hike bike (wmflabs)',
	url:'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
	max_z:20,
	attr:attr.wmflabs
},
{
	name:'OpenStreetMap CyclOSM',
	type:1,
	url:'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
	max_z:20,
	attr:'Участники © '+attr.a_osm+', '+attr.a_fr+', ресурс <a href="https://www.cyclosm.org/" target="_blank">CyclOSM</a>, <a href="https://www.cyclosm.org/legend.html" target="_blank">условные обозначения</a>. <a href="https://www.openstreetmap.org/fixthemap" target="_blank">Сообщить о проблеме</a>.'
},
{
	name:'OpenStreetMap France',
	url:'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
	max_z:20,
	attr:attr.t_osm+', <b>fond de carte</b> par <a href="https://www.openstreetmap.fr/mentions-legales/" title="OpenStreetMap France - mentions légales" target="_blank"><b>OpenStreetMap France</a> sous 📜 licence libre '+attr.by_sa_2
},
{
	name:'OpenStreetMap France HOT',
	url:'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
	max_z:20,
	attr:attr.t_osm+', Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by '+attr.a_fr
},
{
	name:'OpenStreetMap Sweden',
	type:6,
	url:'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
	max_z:20,
	attr:'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data'+attr.t_osm
},
{
	name:'OpenStreetMap Terrain',
	type:5,
	url:'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png',
	max_z:16,
	attr:attr.stamen
},
{
	name:'OpenStreetMap Toner',
	type:4,
	url:'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
	max_z:20,
	attr:attr.stamen
},
{
	name:'OpenStreetMap Watercolor',
	url:'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
	max_z:16,
	attr:attr.stamen
},
{
	name:'Apple',
	url:'http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&v=9&z={z}&x={x}&y={y}',
	max_z:14,
	min_z:3,
	attr:'Map data © <a href="http://www.apple.com/ios/maps/" target="_blank">Apple</a>' 
},
{
	name:'OpenStreetMap GPS',
	type:4,
	url:'https://gps-{s}.tile.openstreetmap.org/gps-lines/tile/{z}/{x}/{y}.png',
	max_z:24
},
{
	name:'OpenStreetMap Public Transport',
	url:'http://tile.memomaps.de/tilegen/{z}/{x}/{y}.png',
	max_z:18,
	attr:attr.osm+', <a target="_blank" href="https://memomaps.de/en/homepage/">MeMoMaps</a>'
},
{
	name:'Esri Street Map',
	url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.jpg',
	max_z:17,//в городе 19 за городом 17
	attr:attr.esri+' map: <a href="https://www.arcgis.com/home/item.html?id=3b93337983e9436f8db950e38a8629af" target="_blank">World Street Map</a>'
},
{
	name:'Esri Imagery',
	type:2,
	url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg',
	max_z:17,//в городе 19 за городом 17
	attr:attr.esri+' map: <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9" target="_blank">World Imagery</a>'
},
{
	name:'Esri Topo Map',
	url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg',
	max_z:17,//в городе 19 за городом 17
	attr:attr.esri+' map: <a href="https://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f" target="_blank">World Topographic Map</a>'
},
{
	name:'Esri Hillshade',
	url:'https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
	type:4,
	max_z:13,
	min_z:1,
	attr:attr.esri+' map: <a href="https://www.arcgis.com/home/item.html?id=f47a5a35be8c41f7890c1763f65a6d9f" target="_blank">World Hillshade</a>'
},
{
	name:'F4map (OSM)',
	url:'https://tile{s}.f4map.com/tiles/f4_2d/{z}/{x}/{y}.png',
	s:"1-4",
	min_z:1,
	attr:'<a href="https://www.f4map.com/" target="_blank">F4map © F4</a>, '+attr.t_osm
},
{
	name:'Falk (OSM)',
	url:'http://ec{s}.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=falk&MapStyle=Falk%20OSM',
	type:1,
	s:"0-3",
	max_z:17,
},
{
	name:'Kompass (OSM)',
	url:'http://ec{s}.cdn.ecmaps.de/WmsGateway.ashx.jpg/demo_dahoam/Summer/{z}/{x}/{y}.png',
	type:1,
	s:"0-3",
	max_z:15,
	attr:'Powered by <a href="http://hubermedia.de/et4-maps/" target="_blank">eT4&reg; MAPS</a> | Map data by &copy; <a href="http://www.kompass.de" target="_blank">KOMPASS Karten GmbH</a>, '+attr.t_osm
},
{
	name:'Kartogiraffe (OSM)',
	url:u_kartogiraffe,
	min_z:1,
	attr:attr.kartogiraffe
},
{
	name:'Kartogiraffe (OSM) transport',
	url:u_kartogiraffe.map((u) => u+'&type=transport'),
	min_z:1,
	attr:attr.kartogiraffe
},
{
	name:'Kartogiraffe (OSM) bicycle',
	url:u_kartogiraffe.map((u) => u+'&type=bicycle'),
	min_z:1,
	attr:attr.kartogiraffe
},
{
	name:'Kartogiraffe (OSM) hiking',
	url:u_kartogiraffe.map((u) => u+'&type=hiking'),
	min_z:1,
	attr:attr.kartogiraffe
},
{
	name:'Kosmosnimki (OSM)',
	url:'http://{s}.tile.osm.kosmosnimki.ru/kosmo/{z}/{x}/{y}.png',
	s:'a-d',
	max_z:17,
	attr:attr.osm+', <a href="https://kosmosnimki.ru/" target="_blank">Kosmosnimki.ru</a>'
},
{
	name:'MapBox Streets',
	url:'https://{s}.tiles.mapbox.com/v3/tmcw.map-7s15q36b/{z}/{x}/{y}.png',
	s:'a-d',
	max_z:17,
	attr:attr.mapbox
},
{
	name:'MapBox Hybrid',
	url:'https://{s}.tiles.mapbox.com/v3/tmcw.map-j5fsp01s/{z}/{x}/{y}.png',
	type:2,
	s:'a-d',
	max_z:30,
	attr:attr.mapbox
},
{
	name:'MapTookit Topo (OSM)',
	url:'https://tile{s}.maptoolkit.net/terrain/{z}/{x}/{y}.png',
	type:1,
	s:'1-4',
	attr:'<a href="https://www.maptoolkit.net/" target="_blank">MapToolkit</a>, © <a href="http://www.toursprung.com" target="_blank">Toursprung</a>, '+attr.t_osm
},
{
	name:'Mapy Base (OSM)',
	url:'https://m{s}.mapserver.mapy.cz/base-m/{z}-{x}-{y}',
	s:'1-4',
	attr:attr.mapy
},
{
	name:'Mapy Winter (OSM)',
	url:'https://m{s}.mapserver.mapy.cz/winter-m/{z}-{x}-{y}',
	type:3,
	s:'1-4',
	attr:attr.mapy
},
{
	name:'Mapy Turist (OSM)',
	url:'https://m{s}.mapserver.mapy.cz/turist-m/{z}-{x}-{y}',
	type:1,
	s:'1-4',
	attr:attr.mapy
},
{
	name:'Mapy Aerial (OSM)',
	url:'https://m{s}.mapserver.mapy.cz/bing/{z}-{x}-{y}',
	type:2,
	s:'1-4',
	attr:attr.mapy
},
{
	name:'Outdooractive (OSM)',
	url:'https://w{s}.outdooractive.com/map/v1/png/osm/{z}/{x}/{y}/t.png?project=api-dev-oa',
	type:1,
	s:'1-3',
	max_z:29,
	min_z:2,
	attr:attr.t_osm+', © <a href="https://www.outdooractive.com/de/map-information.html" target="_blank">Outdooractive</a>, © <a href="https://www.swisstopo.admin.ch/de/home.html" target="_blank">swisstopo</a>, © <a href="http://www.ign.fr/" target="_blank">IGN</a>'
},
{
	name:'Relief SRTM',
	url:'https://maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg',
	type:4,
	max_z:11,
	min_z:2,
	attr:attr.rel
},
{
	name:'Sigma Topo (OSM)',
	url:'https://tiles1.sigma-dc-control.com/layer8/{z}/{x}/{y}.png',
	type:1,
	s:'0-4',
	attr:attr.t_osm
},
{
	name:'Mappy',
	url:'https://map{s}.mappy.net/map/1.0/slab/standard_hd/256/{z}/{x}/{y}',
	s:'1-4',
	attr:'© <a href="https://en.mappy.com/" target="_blank">Mappy</a>'
},
{
	name:'Пустой',
	url:'',
	type:5,
	s:'',
	max_z:30,
	min_z:0,
	attr:'© feb7e9c4d5539ae0f1496cdb2aaee27c'
}
];


var g_srtm = [
{
	name:'default',//'Страны'.
	url:'https://maps-for-free.com/layer/country/z{z}/row{y}/{z}_{x}-{y}.png',
	max_z:9,
	min_z:0,
	attr:attr.rel
},
{
	name:'Округа',
	url:'https://maps-for-free.com/layer/admin/z{z}/row{y}/{z}_{x}-{y}.gif',
	max_z:11
},
{
	name:'Дороги',
	url:'https://maps-for-free.com/layer/streets/z{z}/row{y}/{z}_{x}-{y}.gif',
	max_z:11,
	min_z:2
},
{
	name:'Вода',
	url:'https://maps-for-free.com/layer/water/z{z}/row{y}/{z}_{x}-{y}.gif',
	max_z:11
},
{
	name:'Трава',
	url:'https://maps-for-free.com/layer/grass/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Леса',
	url:'https://maps-for-free.com/layer/forest/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Урожай',
	url:'https://maps-for-free.com/layer/crop/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Тундра',
	url:'https://maps-for-free.com/layer/tundra/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Пески',
	url:'https://maps-for-free.com/layer/sand/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Топь',
	url:'https://maps-for-free.com/layer/swamp/z{z}/row{y}/{z}_{x}-{y}.gif'
},
{
	name:'Лёд',
	url:'https://maps-for-free.com/layer/ice/z{z}/row{y}/{z}_{x}-{y}.gif'
}
];