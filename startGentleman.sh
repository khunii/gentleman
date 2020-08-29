#!/bin/bash

PROCESS='www.js'
PID=`ps -ef | grep ${PROCESS} | grep -v grep | awk '{print $2}'`
workspace='gentleman'
echo "node process ID : $PID"
if [ -z "$PID" ]; then
echo "No process is running"
else
echo "Kill process"
kill -9 $PID
kill -9 `ps -ef | grep ${workspace} | grep -v grep | awk '{print $2}'`
fi
npm start