set source_file=%cd%\test.asm
set output_file=%cd%\test.exe
cd ..\..\compiler\fasmw17331
FASM.EXE %source_file% %output_file%
pause
cd %~dp0
test.exe
echo %ERRORLEVEL%
pause