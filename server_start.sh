#!/bin/bash

BACKEND_PID=$(pm2 pid app)
FRONTEND_PID=$(pm2 pid express)

if [ -z "$BACKEND_PID" ] || [ "$BACKEND_PID" -eq 0 ]; then
    echo "Backend is not running"
    pm2 start app.js --name app
else
    echo "Backend is running. PID: $BACKEND_PID"
    pm2 restart app
    echo "Backend restarted"
fi

cd ../2-sen-noh-community-fe || exit
if [ -z "$FRONTEND_PID" ] || [ "$FRONTEND_PID" -eq 0 ]; then
    echo "Frontend is not running"
    pm2 start express.js --name express
else
    echo "Frontend is running. PID: $FRONTEND_PID"
    pm2 restart express
    echo "Frontend restarted"
fi