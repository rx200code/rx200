cd C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\bin
::gcc.exe C:\pro\c_plus_plus\pro\tcp_ip\client.cpp -Wall -lstdc++ -I C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\i686-w64-mingw32\include -L C:\pro\c_plus_plus\i686-13.1.0-release-win32-dwarf-msvcrt-rt_v11-rev1\mingw32\i686-w64-mingw32\lib -lws2_32 -o C:\pro\c_plus_plus\pro\tcp_ip\client.exe
gcc.exe C:\pro\c_plus_plus\pro\tcp_ip\client.cpp -Wall -lstdc++ -lws2_32 -o C:\pro\c_plus_plus\pro\tcp_ip\client.exe
pause
::cd C:\pro\c_plus_plus\pro\tcp_ip
::client.exe
::echo %ERRORLEVEL%
::pause