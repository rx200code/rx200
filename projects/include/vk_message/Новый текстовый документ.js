var WshShell = WScript.CreateObject("WScript.Shell");
WshShell.Run("https://vk.com/im/convo/1477085");
WScript.Sleep(15000);// Ждем 15 секунд пока браузер откроет месенджер
var str = "С Новым Годом. Рома!";// Обязательно с русской раскладкой клавиатуры.
for(var i = 0; i < str.length; i++){
	WshShell.SendKeys(str.charAt(i));
	WScript.Sleep(200);
}
WshShell.SendKeys("{ENTER}");