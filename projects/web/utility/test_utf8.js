var WshShell = WScript.CreateObject("WScript.Shell");
if(WScript.FullName.lastIndexOf("cscript.exe") == -1){
	WshShell.Run("cscript " + WScript.ScriptName);
	WScript.Quit(0);
}


var fso = new ActiveXObject("Scripting.FileSystemObject");
var nameFile = "text.txt";
var text_file;
if(fso.FileExists(nameFile)){
	var file = fso.OpenTextFile(nameFile, 1);
	text_file = file.ReadAll();
	file.Close();
}


function TextToWindows_1251(sText, srcCharset) {
	var objStream = new ActiveXObject("ADODB.Stream");
	objStream.type = 2;//Binary 1, Text 2 (default)
	objStream.mode = 3;//Permissions have not been set 0,  Read-only 1,  Write-only 2,  Read-write 3,  Prevent other read 4,  Prevent other write 8,  Prevent other open 12,  Allow others all 16
	objStream.charset = "windows-1251";
	objStream.open();
	objStream.writeText(sText);
	objStream.position = 0;
	//objStream.charset = "utf-8";
	//objStream.charset = "cp866";
	objStream.charset = srcCharset;
	var text_out = objStream.readText();
	objStream.close();
	return text_out;
}


while(true){
	WScript.StdOut.WriteLine("¬ведите текст");
	var text_in = WScript.StdIn.ReadLine();
	
	WScript.StdOut.WriteLine(text_in);
	WScript.StdOut.WriteLine(TextToWindows_1251(text_in, "cp866"));
	WScript.StdOut.WriteLine(text_file);
	WScript.StdOut.WriteLine(TextToWindows_1251(text_file, "utf-8"));
	
	if(text_in == ""){
		WScript.StdOut.WriteLine("EXIT");
		WScript.StdIn.ReadLine();
		WScript.Quit(0);
	}
}