::set source_file=%cd%\test.asm
::set output_file=%cd%\test.exe
cd ..\..\compiler\fasmw17331
::FASM.EXE %source_file% %output_file%
echo path: %cd%
cd %~dp0
echo path: %cd%
::echo %source_file%
::echo %output_file%

pause

echo path: %cd%

cd ../../compiler/fasmw17331

echo path: %cd%

pause