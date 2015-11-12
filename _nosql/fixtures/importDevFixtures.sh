#!/bin/sh
#
# This script loads the fixtures with data into your current mongo-db.

# The database to run the import command on.
DATABASE=pelorus-dev
SERVER=127.0.0.1:27017

# The fixtures that will be imported into the database.
FIXTURES=(
    languages,
    config,
    taxonomy
)

# Run the mongoImport command n-times
# Upserts the collection data using "--upsert"
# Drop is possible using "--drop"
# ---
# https://docs.mongodb.org/manual/reference/program/mongoimport/
for fixture in ${FIXTURES[@]}
do
    mongoimport --jsonArray -h $SERVER -d $DATABASE -c $fixture --drop --file json/$fixture.json
done
