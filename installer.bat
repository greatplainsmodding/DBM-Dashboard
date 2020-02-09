@ECHO OFF

:choice
set /P c=Are you sure you want to install the DBM Dashboard [Y/N]?
if /I "%c%" EQU "Y" goto :installFromGit
if /I "%c%" EQU "N" goto :installFromGitNo
goto :choice

:installFromGit
git clone https://github.com/greatplainsmodding/DBM-Dashboard.git
powershell write-host -fore Red Successfully cloned the dashboard from https://github.com/greatplainsmodding/DBM-Dashboard.git

:choice
set /P c=Would you like to automatically install the modules needed [Y/N]?
if /I "%c%" EQU "Y" goto :installModules
if /I "%c%" EQU "N" goto :installModulesNo
goto :choice

:installModules 
cd ./DBM-Dashboard/dbm_dashboard_extension/
npm i
powershell write-host -fore Red Successfully installed all of the needed modules. Please go into the DBM-Dashboard folder and copy the dbm_dashboard_extension folder and dbm_dashboard_extension.js file and paste them into your bots extensions folder.
pause
exit

:installModulesNo
echo Exit installer.
pause
exit

:installFromGitNo
echo Exit installer.
pause
exit
