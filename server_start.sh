#!/bin/bash

SERVER_PID=$(ps aux | grep 'node app.js' | grep -v 'grep' | awk '{print $2}')

if [ -z "$SERVER_PID" ]; then
        echo "server is not running"
else
        echo "server is runiing. PID: $SERVER_PID"
        kill $SERVER_PID
        echo "server is gone"
fi

node app.js &
                                                                                                                           