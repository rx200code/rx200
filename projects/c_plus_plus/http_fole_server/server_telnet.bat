@echo off
rem echo 3 4 |
telnet 127.0.0.1 80
echo Программа завершена с кодом: %ERRORLEVEL%
pause