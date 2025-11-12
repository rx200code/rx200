set source_file=%cd%\test.asm
::set output_file=%cd%\test.obj
::set output_file_exe=%cd%\test.exe
set output_file_com=%cd%\test.com
cd ..\..\compiler\nasm-2.16.01-win32\nasm-2.16.01
nasm.exe -f bin %source_file% -o %output_file_com%
pause
::cd R:\pro\c_plus_plus\pro\x86_64-13.1.0-release-posix-seh-msvcrt-rt_v11-rev1\mingw64\bin
::gcc %output_file% -o %output_file_exe%
::pause
cd %~dp0
::..\..\pro\DOSBox-0.74-3\DOSBox.exe %~dp0\test.com
..\..\pro\DOSBox-0.74-3\DOSBox.exe %~dp0\r.bat -exit
::pause
::test.com
::echo %ERRORLEVEL%
::pause