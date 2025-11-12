set source_file=R:\pro\c_plus_plus\http_fole_server
set source_compiller=R:\pro\c_plus_plus\pro\x86_64-13.1.0-release-posix-seh-msvcrt-rt_v11-rev1\mingw64\bin
set name_compiller=g++.exe
::Для оконных без консоли устакавоиваем парамитер -mwindows
:: -lstdc++
set parameters_compiller=-Wall -mwindows -lws2_32 -lMswsock
set name_file=server
cd %source_compiller%
%name_compiller% %source_file%\%name_file%.cpp %parameters_compiller% -o %source_file%\%name_file%.exe
pause
cd %source_file%
%name_file%.exe
echo %ERRORLEVEL%
pause