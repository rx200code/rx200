set source_file=C:\pro\c_plus_plus\pro\my_game\test
set source_compiller=C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\bin
set name_compiller=g++.exe
::Для оконных без консоли устакавоиваем парамитер -mwindows
set parameters_compiller=-Wall -mwindows
set name_file=test
cd %source_compiller%
%name_compiller% %source_file%\%name_file%.cpp %parameters_compiller% -o %source_file%\%name_file%.exe
pause
cd %source_file%
%name_file%.exe
echo %ERRORLEVEL%
pause