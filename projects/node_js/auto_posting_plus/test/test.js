
const process = require('process');
const https = require('https');
const readline = require('readline');
const child_process = require('child_process');


/// СЮДА ВПИШИТЕ ВАШИ ДАННЫЕ.
const id_vk = "00000";// Ид стандлоне приложения
const user_id = "00000";// Ид вашего аккаунта.
const token = "vk1.00000";// Пользовательский токен доступа с правами публикации или с теме которые нужны.


// функции логирования. // УДАЛЕНО запись в файлы.
process.on('exit', (code) => {
	if(code)err(`Exit error code: ${code}`);
});
async function out(text){
	console.log(text);
}
async function outLog(text){
	console.log('\x1b[1m%s\x1b[0m', text);
	//writeLog(text);
}
async function err(text){
	console.error('\x1b[33m%s\x1b[0m', text);
}
async function errLog(text){
	console.error('\x1b[33;1m%s\x1b[0m', text);
}
async function errExit(text){
	await err(text);
	process.exit(7);
}
async function errExitLog(text){
	await errLog(text);
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
// функция запуска браузера. //  Для капчи.
var command_exec_browser;
if(process.platform === 'win32'){
	command_exec_browser = "start firefox ";
}else if(process.platform === 'linux'){
	command_exec_browser = "xdg-open ";
}else if(process.platform === 'darwin'){
	command_exec_browser = "open ";
}else process.exit(3);

function exec_browser(url){
	child_process.execSync(command_exec_browser + "\"" + url+ "\"");
}

// Сообщения об ошибках.
const strErrReqest = "ОШИБКА запроса, проверте интернет и нажмите enter, для повторной попытки запроса, или введите exit для выхода из программы.";

// глобальные константы.

const host_vk_api = "api.vk.ru";
const path_vk_api = "/method/";
const v_api = "5.199";
const boundary = "rx2008439205948372";// Сюда уникальное что угодно впишите чтоб в запросе небыло такого.
const title_message = "--" + boundary + "\nContent-Disposition: form-data; name=\"access_token\"\n\n" + token + "\n--" + boundary + "\nContent-Disposition: form-data; name=\"v\"\n\n" + v_api + "\n";

const startDate = new Date();
const startTime = startDate.getTime();
const limit_execution = 1 * 60 * 60 * 1000;// лимит выполнения скрипта. // 1 час.
const endTime = limit_execution + startTime;

var startDay;

var time_request = 0;
const time_offset_short = 2000;// 340;// один вызов. // для time_offset
const time_offset_long = 6000;// 1020;// три вызов. // для time_offset
var time_offset = time_offset_short;




async function request_0(method, obj_parameters){
	/**/
	// TEST
	//await out("запрос: " + method + ", obj_parameters: " + obj_parameters);
	/**/
	let captcha = "";
	let message = title_message;
	for(let name in obj_parameters)message += "--" + boundary + "\nContent-Disposition: form-data; name=\"" + name + "\"\n\n" + obj_parameters[name] + "\n";

	while(true){
		// Проверка времени интервал 1000 милисекунд, не больше трех запросов в секунду.
		let sleep_time = time_offset - (Date.now() - time_request);
		if(sleep_time > 0)await sleep(sleep_time);
		// Проверка времени выполнения всего скрипта endTime по limit_execution.
		if(endTime < Date.now())await errExitLog("Время выполнения скрипта превышено,1 час limit_execution");
		// запрос
		let strResult = await request_vk_api(method, message + captcha + "--" + boundary + "--\n");
		time_request = Date.now();
		// проверяем результат на ошибки.
		if(typeof strResult !== "string"){// Ошибки сети, не вк
			await outLog(strResult + "\n");
			if(await input(strErrReqest) === "exit")await errExitLog("exit user");
		}else if(strResult.indexOf("error") != -1){// Ошибки vk api
			if(strResult.indexOf("\"error_code\":14") != -1 && strResult.indexOf("Captcha") != -1){// Обработка капчи.
				out("Ошибка капчи: " + strResult);
				let obj_error = (JSON.parse(strResult)).error;
				
				if("redirect_uri" in obj_error){
					exec_browser(obj_error.redirect_uri);
					let captcha_key = await input("Новая капча открылась в браузере, подождите и отправьте запрос заново, или введите exit для выхода:");
					if(captcha_key != "exit"){
						captcha = "";
						continue;
					}
				}else if("captcha_img" in obj_error){
					exec_browser(obj_error.captcha_img);
					let captcha_key = await input("Введите текст с картинки в браузере или exit для выхода:");
					if(captcha_key != "exit"){
						captcha = "--" + boundary + "\n";
						captcha += "Content-Disposition: form-data; name=\"captcha_sid\"\n\n" + obj_error.captcha_sid + "\n";
						captcha += "--" + boundary + "\n";
						captcha += "Content-Disposition: form-data; name=\"captcha_key\"\n\n" + captcha_key + "\n";
						continue;
					}
				}
			}

			let test = await input("введите \"q\" чтоб выйти или Enter чтобы пропустить запрос.");
			if(test == "q"){
				await errExitLog("method_vk: " + method + "\nparameters: " + JSON.stringify(obj_parameters, null, "\t") + "\nreport: " + strResult);
			}else{
				errLog("method_vk: " + method + "\nparameters: " + JSON.stringify(obj_parameters, null, "\t") + "\nreport: " + strResult);
				return strResult;
			}
		}
		return strResult;
	}
}


function request_vk_api(method, message){
	return new Promise(resolve => {// (resolve, reject)
		let strResult = "";
		const options = {
			hostname: host_vk_api,
			port: 443,
			path: path_vk_api + method,
			method: 'POST',
			headers: {
				'Content-Type': "multipart/form-data; boundary=" + boundary,
				'Content-Length': Buffer.byteLength(message, 'utf8')//message.length
			}
		};
		const req = https.request(options, (res) => {
			res.on('data', (data) => {
				strResult += data;
			});
			res.on('end', () => {
				resolve(strResult);
			});
			
		});
		req.on('error', (error) => {
			resolve(error);
		});
		req.write(message);
		req.end();
	});
}

async function main(){// await
	
	await out("TEST");
	// Пример постинга. вообще в request_0 можете любые запросы делатью
	await out(
		await request_0("wall.post", {
			owner_id: "-222541136",
			message: "Тест 777",
			attachments: "photo1477085_457239885"
		})
	);
	await out("TEST END");
	return;
	
}


// дополнительные функции.
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

main();