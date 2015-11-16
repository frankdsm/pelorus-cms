:: This script loads the fixtures with data into your current mongo-db.
@echo off

:: The database to run the import command on.
set DATABASE=test
set SERVER=127.0.0.1:27017

:: The fixtures that will be imported into the database.
set FIXTURES=languages,config,taxonomy,footer,fieldtypes,contenttypes,content,pages,views

:: Run the mongoImport command n-times
:: Upserts the collection data using "--upsert"
:: Drop is possible using "--drop"
:: ---
:: https://docs.mongodb.org/manual/reference/program/mongoimport/
for %%i in (%FIXTURES%) do (
    mongoimport.exe --jsonArray -h %SERVER% -d %DATABASE% -c %%i --drop --file json/%%i%.json
)
