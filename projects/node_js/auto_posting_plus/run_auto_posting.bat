@echo off
set source_file=%CD%
set name_file=auto_posting.js
set source_run=R:\pro\node_js\node-v20.16.0-win-x64
set name_run=node.exe
:: Параметры
set parameters_run=

cd %source_run%
%name_run% %source_file%\%name_file% %parameters_run%
::start "" %source_run%\%name_run% %source_file%\%name_file% %parameters_run%








pause