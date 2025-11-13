cd C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\bin
::g++.exe C:\pro\c_plus_plus\pro\winapi\test.cpp -Wall -o C:\pro\c_plus_plus\pro\winapi\test.exe
g++.exe C:\pro\c_plus_plus\pro\winapi\test.cpp -Wall -mwindows -o C:\pro\c_plus_plus\pro\winapi\test.exe
pause
cd C:\pro\c_plus_plus\pro\winapi
test.exe
echo %ERRORLEVEL%
pause