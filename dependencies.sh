#!/bin/sh
#install dependencies

g='\033[0;32m' # Green
lg='\033[1;32m' # Light Green
lga='\033[0;37m' # Light Gray
NC='\033[0m' # No Color

echo "${g}"
echo "           +---------------------------------------------------------------+"
echo "           |                  ${lga}Installing NPM dependencies${g}                  |"
echo "           +---------------------------------------------------------------+"
npm install
echo "${g}"
echo "           +---------------------------------------------------------------+"
echo "           |                  ${lga}Installing Bower Components${g}                  |"
echo "           +---------------------------------------------------------------+"
bower install
echo "${g}"
echo "           +---------------------------------------------------------------+"
echo "           |                  ${lga}Installing Bundle components${g}                 |"
echo "           +---------------------------------------------------------------+"
bundle install