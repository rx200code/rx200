/*
var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript.exe  " + WScript.ScriptName);
	WScript.Quit(0);
}
//*/

function errorExit(text){
	WScript.StdOut.WriteLine("ERROR: " + text);
	WScript.StdIn.ReadLine();
	WScript.Quit(1);
}

var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
var JSON = htmlfile.parentWindow.JSON;
htmlfile.close();

var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFilePosts = "../posts.json";
var posts;
var nameFilePersons = "../persons.json";
var persons;
var nameFileAnimals = "../animals.json";
var animals;




if(fso.FileExists(nameFilePosts)){
	file = fso.OpenTextFile(nameFilePosts, 1);
	posts = JSON.parse(file.ReadAll());
	file.Close();
}else errorExit("not file " + nameFilePosts);

if(fso.FileExists(nameFilePersons)){
	file = fso.OpenTextFile(nameFilePersons, 1);
	persons = JSON.parse(file.ReadAll());
	file.Close();
}else errorExit("not file " + nameFilePersons);

if(fso.FileExists(nameFileAnimals)){
	file = fso.OpenTextFile(nameFileAnimals, 1);
	animals = JSON.parse(file.ReadAll());
	file.Close();
}else errorExit("not file " + nameFileAnimals);



//var startDate = new Date(2023,2,1);
//var test_date = [27,2,2023];
//var test_date = [1,3,2024];
//var startDate = new Date(test_date[2],test_date[1] - 1, test_date[0]);
var startDate = new Date();
var startTime = startDate.getTime();
//var startZoneOffset = startDate.getTimezoneOffset() * -60000;
posts.forEach(function(post){
	/*
	WScript.StdOut.WriteLine("id:" + post.id);
	WScript.StdOut.WriteLine("animal_id:" + post.animal_id);
	WScript.StdOut.WriteLine("contacts_id:" + post.contacts_id);
	WScript.StdOut.WriteLine("message:" + post.message);
	WScript.StdOut.WriteLine();
	//WScript.StdOut.WriteLine("TITLE:" + post.message.indexOf("%TITLE%"));
	//*/
	
	var animal;//animals.find(function(a){return a.id == post.animal_id;});
	
	for(var i = 0; i < animals.length; i++){
		if(animals[i].id === post.animal_id){
			animal = animals[i];
			break;
		}
	}
	
	
	
	var day = startDate.getDate() - animal.date_birth[0];
	var month = startDate.getMonth() + 1 - animal.date_birth[1];
	var year = startDate.getFullYear() - animal.date_birth[2];
	/*
	WScript.StdOut.WriteLine("year: " + year);
	WScript.StdOut.WriteLine("month: " + month);
	WScript.StdOut.WriteLine("day: " + day);
	//*/
	if(day < 0){
		offset_day = new Date(startDate.getFullYear(), startDate.getMonth(), 0).getDate();
		if(offset_day < animal.date_birth[0])offset_day = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
		day += offset_day;
		month--;
	}
	if(month < 0){
		month += 12;
		year--;
	}
	/*
	WScript.StdOut.WriteLine("date______: " + startDate);
	WScript.StdOut.WriteLine("date_birth: " + animal.date_birth);
	WScript.StdOut.WriteLine("year: " + year);
	WScript.StdOut.WriteLine("month: " + month);
	WScript.StdOut.WriteLine("day: " + day);
	//*/
	var age = "возраст";
	if(animal.age_accuracy > 0)age += " примерно";
	age += ":";
	if(year > 0){
		age += " " + year;
		if((year < 21 && year > 4) || (year > 24 && year % 10 > 4))age += " лет";// если больше ста то вместо year > 24 пишем year % 100 > 24
		else if(year == 1 || (year > 20 && year % 10 == 1))age += " год";// если больше ста то вместо year > 20 пишем year % 100 > 20
		else age += " года";// if((year > 1 && year < 5) || (year > 21 && year % 10 > 1 && year % 10 < 5))
	}
	if(month > 0 && (animal.age_accuracy == 0 || year == 0)){
		age += " " + month;
		if((month < 21 && month > 4) || (month > 24 && month % 10 > 4))age += " месяцев";// || month == 0
		else if(month == 1 || (month > 20 && month % 10 == 1))age += " месяц";
		else age += " месяца";
	}
	if((year == 0 && month == 0) || (animal.age_accuracy == 0 && day > 0)){
		age += " " + day;
		if((day < 21 && day > 4) || (day > 24 && day % 10 > 4) || day == 0)age += " дней";
		else if(day == 1 || (day > 20 && day % 10 == 1))age += " день";
		else age += "дня";
	}
	
	//WScript.StdOut.WriteLine("age: " + age);
	
	
	
	var type;
	if(animal.species === "cat"){
		if(animal.gender === "m")type = year < 1 ? "Котик" : "Кот";
		else type = year < 1 ? "Котёнок" : "Кошка";
	}else if(animal.species === "dog"){
		if(year < 1)type = "Щенок";
		else if(animal.gender === "m")type = "Пёс";
		else type = "Собака";
	}
	
	
	// TITLE пример - Кот Вася, возраст 5 лет.
	var title = type + " " + animal.name + ", " + age + ".";
	
	//WScript.StdOut.WriteLine("title: " + title);
	WScript.Echo("title: " + title);
	
	
	
	
	/*
	var age = startDate.getFullYear() - animal.date_birth[2];
	if(animal.date_birth[1] - 1 > startDate.getMonth() || (animal.date_birth[1] - 1 == startDate.getMonth() && animal.date_birth[0] > startDate.getDate()))age--;
	
	if(age < 1){
		var month = startDate.getMonth() - (animal.date_birth[1] - 1);
		if(startDate.getMonth() < (animal.date_birth[1] - 1))month += 12;
		else if(startDate.getMonth() == (animal.date_birth[1] - 1) && animal.date_birth[2] < startDate.getFullYear())month = 11;
		title += month + " ";
		if(month > 4 || month == 0)title += "мес¤цев";
		else if(month == 1)title += "мес¤ц";
		else title += "мес¤ца";
	}else{
		title += age + " ";
		if(age > 4)title += "лет";
		else if(age == 1)title += "год";
		else title += "года";
	}
	title += ".\n";
	
	WScript.StdOut.WriteLine("age: " + age);
	WScript.StdOut.WriteLine("date: " + animal.date_birth);
	WScript.StdOut.WriteLine("TITLE: " + title);
	//*/
	
	//*/
	/*
	resources.forEach(function(resource){
		// ѕроверка можноли публиковать.
		// провер¤ем соответствие вида животного ресурсу.
		if(resource.species != "all" && resource.species != post.species)return;
		
		// зпрос на публикацию.
		
		// сохранение результата ????
		
		// TEST
		WScript.Echo(post.message + " in id_resource = " + resource.id);
	});//*/
	
	
	
});




//WScript.StdOut.WriteLine("EXIT");
//WScript.StdIn.ReadLine();
WScript.Quit(0);
