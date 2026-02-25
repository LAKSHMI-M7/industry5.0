@echo off
if not exist "C:\mongo_local_data" mkdir "C:\mongo_local_data"
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\mongo_local_data --port 27017 --bind_ip_all
pause

