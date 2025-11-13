cd C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\bin

::С консолью
::g++.exe C:\pro\c_plus_plus\pro\sfml\test.cpp -Wall -I C:\pro\c_plus_plus\SFML-2.6.0-windows-gcc-13.1.0-mingw-32-bit\SFML-2.6.0\include -L C:\pro\c_plus_plus\SFML-2.6.0-windows-gcc-13.1.0-mingw-32-bit\SFML-2.6.0\lib -lsfml-graphics -lsfml-window -lsfml-system -o C:\pro\c_plus_plus\pro\sfml\test.exe

g++.exe C:\pro\c_plus_plus\pro\sfml\test.cpp -Wall -mwindows -I C:\pro\c_plus_plus\SFML-2.6.0-windows-gcc-13.1.0-mingw-32-bit\SFML-2.6.0\include -L C:\pro\c_plus_plus\SFML-2.6.0-windows-gcc-13.1.0-mingw-32-bit\SFML-2.6.0\lib -lsfml-graphics -lsfml-window -lsfml-system -o C:\pro\c_plus_plus\pro\sfml\test.exe
pause
cd C:\pro\c_plus_plus\pro\sfml
test.exe
echo %ERRORLEVEL%
pause