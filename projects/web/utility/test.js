var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript.exe " + WScript.ScriptName);
	WScript.Quit(0);
}

startDate = new Date();
startTime = startDate.getTime();
startZoneOffset = startDate.getTimezoneOffset() * -60000;

function dayWeek(time, timeZoneOffset){// 3 Воскресенье. 0 Четверг.
	if(timeZoneOffset === undefined){
		timeZoneOffset = startZoneOffset;
		if(time === undefined)time = startTime;
	}
	time += timeZoneOffset;
	return ((time / 86400000) | 0) % 7;
}

var week = ["четверг", "пятница", "суббота", "воскресенье", "понедельник", "вторник", "среда"];

WScript.StdOut.WriteLine(startDate);
WScript.StdOut.WriteLine(dayWeek(startTime));
WScript.StdOut.WriteLine(week[dayWeek(startTime)]);

WScript.StdOut.WriteLine("EXIT");
WScript.StdIn.ReadLine();
WScript.Quit(0);




























