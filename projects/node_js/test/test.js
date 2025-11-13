/*
// СПРАВКА
\x1b[4Xm — для фона
\x1b[3Xm — для текста
\x1b[3X;1m — для жирного текста
\x1b[30m — Черный
\x1b[31m — Красный
\x1b[32m — Зеленый
\x1b[33m — Желтый
\x1b[34m — Синий
\x1b[35m — Пурпурный (пурпурный)
\x1b[36m — Голубой (голубой)
\x1b[37m — Белый
\x1b[90m — Серый
\x1b[0m — Сброс всех атрибутов
/**/
const process = require('process');
const readline = require('readline');
const child_process = require('child_process');



//// функция логироапния.
/**
const name_log_file = "log";
const path_log_file = dir + separator + dir_data + separator + name_log_file;
var fd_log;
try{
	// дискриптор файла для логирования.
	fd_log = fs.openSync(path_log_file, 'a');
}catch(err){
	errExit(err);
}
/**/
async function writeLog(text){
	//fs.writeSync(fd_log, Date.now() + " " + text + "\n");
}
// функции логирования.
process.on('exit', (code) => {
	if(code)err(`Exit error code: ${code}`);
});

async function out(text){
	console.log(text);
}
async function outLog(text){
	console.log('\x1b[1m%s\x1b[0m', text);
	writeLog(text);
}
async function err(text){
	console.error('\x1b[33m%s\x1b[0m', text);
}
async function errLog(text){
	console.error('\x1b[33;1m%s\x1b[0m', text);
	await writeLog(text);
}
async function errExit(text){
	await err(text);
	//fs.closeSync(fd_log);
	process.exit(7);
}
async function errExitLog(text){
	await errLog(text);
	//fs.closeSync(fd_log);
	process.exit(8);
}
// функция запроса из консоли
function input(text){
	return new Promise(resolve => {
		const rl = readline.createInterface({input: process.stdin, output: process.stdout});
		rl.question("\x1b[34;1m" + text + "\x1b[0m ", (text) => {
			rl.close();
			resolve(text);
		});
	});
}
// функция запуска браузера.
var command_exec_browser;
if(process.platform === 'win32'){
	command_exec_browser = "start ";
}else if(process.platform === 'linux'){
	command_exec_browser = "xdg-open ";
}else if(process.platform === 'darwin'){
	command_exec_browser = "open ";
}else process.exit(3);

function exec_browser(url){
	child_process.execSync(command_exec_browser + "\"" + url+ "\"");
}
const one_day = 24 * 60 * 60 * 1000;
async function AddDays(date, days){
	return new Date(date.getTime() + days * one_day);
}
async function main(){// await
	await outLog("START");
	
	const days_a_week = 7;
	const week = 53;

	let data = new Date(1990, 7, 13, 4, 24, 0);
	
	/**/
	let activityTestData = new Array(week);
	for(let i = activityTestData.length - 1; i >= 0; --i)activityTestData[i] = [];
	
	//let current = await AddDays(data, -2);
	//for(let i = week * days_a_week - current.getDay() - 1; i >= 0; --i)activityTestData[i / days_a_week | 0][ i % days_a_week] = current = await AddDays(current,-1);
	//let current = await AddDays(data, (data.getDay() + 3) % 7);

	/**
DateTime current = DateTime.now.Date;
current = current.AddDays((7 - current.DayOfWeek) % 7 + 1);


DateTime[,] activityTestData = new DateTime[53, 7];
DateTime current = DateTime.now.Date.AddDays(1);
for(int i = 53 * 7 - ((7 - DateTime.now.Date.DayOfWeek()) % 7 + 1); i >= 0; --i)activityTestData[i / 7, i % 7] = current = current.AddDays(-1);
	/**/
	//let current = await AddDays(data,1);
	//let d = (7 - data.getDay()) % 7 + 1;
	//for(let i = week * days_a_week - d; i >= 0; --i)activityTestData[i / days_a_week | 0][ i % days_a_week] = current = await AddDays(current,-1);

	//let current = data;
	//let d = (7 - data.getDay()) % 7 + 1;
	//for(let i = week * days_a_week - d; i >= 0; --i)current = await AddDays(activityTestData[i / days_a_week | 0][ i % days_a_week] = current,-1);


	const sizeActivityTestData = week * days_a_week;
	let current = data;
	const offsetDays_a_week = (7 - current.getDay()) % 7;
	const daysActivityTestData = sizeActivityTestData - offsetDays_a_week;
	current = await AddDays(current, 1 - daysActivityTestData);
	for(let i = 0; i < daysActivityTestData; i++)
		activityTestData[i / days_a_week | 0][i % days_a_week] = await AddDays(current, i);


	//await out("activityTestData: " + JSON.stringify(activityTestData, null, "\t"));
	/**/

	/**/
	let activityTestData_2 = new Array(week);
	for(let i = activityTestData_2.length - 1; i >= 0; --i)activityTestData_2[i] = [];
	
	let current_2 = data;
	
	for(let i = activityTestData_2.length - 1; i >= 0; --i){
		let j = current_2.getDay() - 1;
		if(j == -1)j = 6;
		while(j >= 0){
			//activityTestData_2[i][j] = current_2 + " " + current_2.getDay();
			
			activityTestData_2[i][j] = current_2;
			if(activityTestData_2[i][j]+"" != activityTestData[i][j]+"")await out("activityTestData: " + activityTestData[i][j] + " " + activityTestData_2[i][j]);
			current_2 = await AddDays(current_2,-1);
			j--;
		}
	}



	//await out("activityTestData_2: " + JSON.stringify(activityTestData_2, null, "\t"));
	await out(data.getDay());
	/**/


	await outLog("END");
}


// дополнительные функции.
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

main();