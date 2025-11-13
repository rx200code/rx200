cd C:\pro\c_plus_plus\i686-8.1.0-release-win32-dwarf-rt_v6-rev0\mingw32\bin
gcc.exe C:\pro\c_plus_plus\pro\hex_viewer\test.cpp -Wall -lstdc++ -o C:\pro\c_plus_plus\pro\hex_viewer\test.exe
pause
cd C:\pro\c_plus_plus\pro\hex_viewer
test.exe
echo %ERRORLEVEL%
pause