//САМЫЕ БЫСТРЫЕ ФУНКЦИИ получения тайлов Web Mercator EPSG:3857

// Константы PI
const rad_180 = Math.PI;
const rad_45 = rad_180 / 4;
const rad_90 = rad_180 / 2;
const deg_2rad = 360 / rad_180;// 2 радиана в градусах

// Уровень зума, как пример 15
let zoom = 15;

// Параметры для работы функций перевода в тайлы Веб меркатора и обратно, должны обновлятся при изменении зума.
let half_length_WM = 2 ** (zoom - 1);//let half_length_WM = 1 << (zoom - 1);// половина длины Веб меркатора в тайлах(tile = 1), Math.log2(tile) = 0;
let radius_WM = half_length_WM / rad_180;// Радиус веб меркатора, если считать длину в количестве тайлов на сторону.
let deg_WM = half_length_WM / 180;// Один градус долготы Веб меркатора в тайлах.

// Функции перевода в Веб меркатор в тайлах и обратно. функции для работы с радианами заканчиваются на Rad.
const toYRad = lat_rad => half_length_WM - radius_WM * Math.log(Math.tan(lat_rad / 2 + rad_45));// получает Y Веб Меркатора исходя из широты в радианах(lat_rad).
const toY = lat => half_length_WM - radius_WM * Math.log(Math.tan(lat / deg_2rad + rad_45));// получает Y Веб Меркатора исходя из широты в градусах(lat).
const toLatRad = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * 2 - rad_90;// обратная toYrad()
const toLat = y => Math.atan(Math.exp((half_length_WM - y) / radius_WM)) * deg_2rad - 90;// обратная toY()
const toXRad = lon_rad => lon_rad * radius_WM + half_length_WM;// получает X Веб Меркатора исходя из долготы в радианах(lon_rad).
const toX = lon => lon * deg_WM + half_length_WM;// получает X Веб Меркатора исходя из долготы в градусах(lon).
const toLonRad = x => x / radius_WM - rad_180;// обратная toXrad()
const toLon = x => x / deg_WM - 180;// обратная toX()

/* ДЛЯ СПРАВКИ *
const lat_min = -85.0511287;//Более точное значение -85.0511287798065822585;
const lat_max = 85.0511287;//Более точное значение 85.0511287798065822585;
const lon_min = -180;
const lon_max = 180;
const zoom_min = 0;
/**/
