@echo off
cd /d %~dp0
C:\Python314\pythonw.exe ghost_prompt.py
if errorlevel 1 pause
