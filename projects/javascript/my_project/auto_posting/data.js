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
const service_key = "xxxxxXXxxxxx";
// access_token
const user_key = "vk1.a.xxxxxXXxxxxx";

//const user_key = "vk1.xxxxxXXxxxxx";



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
	access_token: "k1.xxxxxXXxxxxx"
};

































