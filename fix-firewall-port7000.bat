@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo  RRMS - Sua Firewall Port 7000 va Bo Chan Java (Mobile)
echo =======================================================
echo.

:: Kiem tra quyen Administrator, tu dong xin quyen neu chua co
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [THONG BAO] Dang yeu cau quyen Administrator (UAC)...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo [1/3] Dang xoa cac quy tac CHAN (Block) doi voi Java trong Windows Firewall...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Get-NetFirewallRule | Where-Object { $_.Action -eq 'Block' } | Where-Object { $prog = ($_ | Get-NetFirewallApplicationFilter).Program; $prog -and $prog -like '*java.exe*' } | ForEach-Object { Write-Host '  - Xoa block rule:' $_.DisplayName; $_ | Remove-NetFirewallRule }"

echo.
echo [2/3] Dang cap nhat quy tac CHO PHEP (Allow) Port 7000...
netsh advfirewall firewall delete rule name="RRMS Backend Port 7000" >nul 2>&1
netsh advfirewall firewall add rule name="RRMS Backend Port 7000" protocol=TCP dir=in localport=7000 action=allow profile=any >nul 2>&1
if %errorlevel%==0 (
    echo   [OK] Da cho phep inbound TCP Port 7000!
) else (
    echo   [LOI] Khong the them rule port 7000!
)

echo.
echo [3/3] Dang cap nhat quy tac CHO PHEP (Allow) Java JDK 17...
set "JAVA_EXE=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin\java.exe"
if exist "%JAVA_EXE%" (
    netsh advfirewall firewall delete rule name="RRMS Java 17 Backend" >nul 2>&1
    netsh advfirewall firewall add rule name="RRMS Java 17 Backend" dir=in action=allow program="%JAVA_EXE%" enable=yes profile=any >nul 2>&1
    echo   [OK] Da cho phep file java.exe chay backend!
)

echo.
echo =======================================================
echo  HOAN TAT!
echo  Hay quay lai ung dung mobile hoac reload de thu lai.
echo =======================================================
echo.
pause
