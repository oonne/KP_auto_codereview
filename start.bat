@echo off
:START
npm run start
if %errorlevel% neq 0 goto START