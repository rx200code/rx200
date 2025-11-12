var WshShell = WScript.CreateObject("WScript.Shell");
/*
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}*/
WshShell.Run("https://vk.com/im/convo/1477085?entrypoint=list_all");
WScript.Sleep(15000);// Ждем 15 секунд пока браузер откроет месенджер

var str = "С Новым Годом. Рома!";// Обязательно с русской раскладкой клавиатуры.
for(var i = 0; i < str.length; i++){
	WshShell.SendKeys(str.charAt(i));
	WScript.Sleep(200);
}
WshShell.SendKeys("{ENTER}");
/*
WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);*/






















