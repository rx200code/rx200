var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}

//WshShell.Run("https://vk.com/im/convo/1477085?entrypoint=list_all");

WScript.Sleep(2000);// Ждем 10 секунд пока браузер откроет месенджер
//WshShell.SendKeys(WScript.Arguments(0));
/**/
//var str = ["С"," ","Н","о","в","ы","м"," ","Г","о","д","о","м","."," ","Р","о","м","а","!"];//"С Новым Годом. Рома!".split("");
var str = "С Новым Годом. Рома!".split("");
for(var i = 0; i < str.length; i++){
	
	WshShell.SendKeys(str[i]);
	//WScript.StdOut.WriteLine(str[i]);
	WScript.Sleep(250);
}/**/
/**
WshShell.SendKeys("С");
WScript.Sleep(250);
WshShell.SendKeys(" ");
WScript.Sleep(250);
WshShell.SendKeys("Н");
WScript.Sleep(250);
WshShell.SendKeys("о");
WScript.Sleep(250);
WshShell.SendKeys("в");
WScript.Sleep(250);
WshShell.SendKeys("ы");
WScript.Sleep(250);
WshShell.SendKeys("м");
WScript.Sleep(250);
/**/
//WshShell.SendKeys("{ENTER}");
/**
var strCopy = "This text has been copied to the clipboard.";
//WshShell.SendKeys(WScript.Arguments(0));
//WshShell.SendKeys("{ENTER}");
//WSH.SendKeys("x"); 
//WSH.SendKeys("{ENTER}");
/**
var objIE = new ActiveXObject("InternetExplorer.Application");
objIE.Navigate("about:blank");
objIE.document.parentwindow.clipboardData.SetData("text", strCopy);
objIE.Quit();
/**/
/**
var htmlfile = WSH.CreateObject('htmlfile');
htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
//htmlfile.write("about:blank");
htmlfile.parentWindow.clipboardData.setData("text", strCopy);
WScript.StdOut.WriteLine(htmlfile.parentWindow.clipboardData.getData("text"));
htmlfile.close();
/**/
//WScript.CreateObject("HTMLFile").parentWindow.clipboardData.setData("text", "Текст для вставки в буфер");


WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();

WScript.Quit(0);






















