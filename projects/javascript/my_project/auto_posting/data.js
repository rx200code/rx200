// Данные для публикации.
/* Структура
// Что публикуем.
post = {
	text: "",
	photo: ""
};

// Куда публикуем.
target = [
	{
		url:"",
		add_top_text:"",// Необязательный
		add_buttom_text:""// Необязательный
	}
];

// Кто публикует.
access_token = "";
//*/
const service_key = "c2c986f6c2c986f6c2c986f617c1dc1bf9cc2c9c2c986f6a79a0792f8b2951e2b1f78f5";
// access_token
const user_key = "vk1.a.RN2x_gJhPUkEkTjr8DoJy42eiqT2WzsmWFBzxymAk22sPoj7x8fuycTWykuJt4MBMHRP1unxFog-BYJsit4KfKw7KDitjboFIDRWUIZt85KoINw2uQZAYRfC-JvhC3m7VOCUiojceDhqW5BD--c18ACliwa2pqp-JaJx4q1wcxvbBYBRnL78_xV57rjJDePSZFE9YkpVo2s1_gATUAmeLQ";

//const user_key = "vk1.a.aafyo-yc533QPocH-Z-2HX0bIbCNpR1xAsxAkWTsxNZ49dB6N5k5mcBZQ2o4fIVchmvnAI02hK6QV0xcHWGT52UA3VeJVsP6J_SRxY2242JqfUCDR49xaIB3t35A0YrTInKj3vKJlvnncUDzlHwuseWGj14ULxTl47R9H-DOVj8nQ-kfGs0sLKs7RUKG6ZlukE5qxunG43J2qY1s0R67iQ";



const post = {
	// Что публикуем.
	text: `Пропали два кота.
Серый, полосатый, гладкошерстный. Возраст 3,5 года. Потерялся 22 августа
Серый, длинношерстный. Слабо полосатый. Особая примета – шишка на хвосте. Возраст 3,5 года. Потерялся 2 сентября
Потерялись на Ягодной, СНТ Ветеран войны. Пропали оба в субботне- воскресные дни, возможно кто-то увез с собой.
Очень ждем
Телефон 89134568791 (8 913 456 87 91)
89607859080`,
	photo: "photo1477085_457239662,photo1477085_457239663",
	lat: "55.16424",// Необязательный
	lon: "82.82331",// Необязательный, В ВК long
	// Куда публикуем.
	targets: [
		{// цель для тестов.
			url:"https://vk.com/public222541136",
			add_top_text:"ПОВТОР!! ",
			add_buttom_text: `
#Ягодная@poterjashkansk
#Рыбачий@poterjashkansk
#НСО@poterjashkansk
#poterjashkansk #потеряшканск #потерянныеживотныеновосибирск`
		},
		{
			url:"https://vk.com/poterjashkansk",
			add_top_text:"ПОВТОР!! ",
			add_buttom_text: `
#Ягодная@poterjashkansk
#Рыбачий@poterjashkansk
#НСО@poterjashkansk
#poterjashkansk #потеряшканск #потерянныеживотныеновосибирск`
		},
		{
			url:"https://vk.com/nsknahodka",
			add_top_text:"",
			add_buttom_text: ``
		},
	],
	// Кто публикует.
	access_token: "k1.a.5Z-5A0zMMI0FtnoD5pSZE0zuxo9doNCci0BxxN8HgD3JFMyGhB5omAQqds-MfFBE6r5Jq_wv5SkLwoZd4DbhBiBJe-WUnVijou6TfEhBCBxX1xMAzkH70yjHyGjCU60R6AK-BchB7uOUnLnUMxmwsHkzq3U-UJopVA5a9c24GC2_YBjdG2qhk4DAbd9pQ5Zd9yHaf4Ix_yODQyfHThLFWg"
};
































