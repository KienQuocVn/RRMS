@echo off
setlocal

REM Compile first so MapStruct/Lombok annotation processors generate mapper implementations
REM before Spring Boot starts. This avoids missing bean errors such as AccountMapper.
call "%~dp0mvnw.cmd" -DskipTests compile spring-boot:run -Dspring-boot.run.profiles=dev
set EXIT_CODE=%ERRORLEVEL%

endlocal & exit /b %EXIT_CODE%
