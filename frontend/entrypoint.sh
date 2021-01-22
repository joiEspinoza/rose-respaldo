#!/bin/sh

find ./*  -type f -print0 | xargs -0 sed -i "s/http:\/\/127.0.0.1:8000/https:\/\/${BACK_URL}/g" 
find ./*  -type f -print0 | xargs -0 sed -i "s/http:\/\/localhost:8000/https:\/\/${BACK_URL}/g" 
sleep 2
yarn build
rsync -auv --delete ./build /data/frontend/

