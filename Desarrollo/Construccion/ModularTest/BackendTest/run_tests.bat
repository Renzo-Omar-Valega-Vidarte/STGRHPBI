@echo off
setlocal

REM --- Configuración de entorno ---
set RUNNING_TESTS=1

REM --- Cambia al directorio donde está test_main.py ---
cd /d C:\Users\RENZO\Documents\GitHub\STGRHPBI\Desarrollo\Construccion\ModularTest\BackendTest

REM --- Ejecutar los tests con salida detallada ---
echo Ejecutando tests con pytest...
pytest -s -v test_main.py

pause
