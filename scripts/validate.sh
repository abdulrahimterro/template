#!/usr/bin/env bash
sleep 3 # wait database connection

cd /home/ec2-user/pizza

export PORT='2053'
# echo 'validate PORT'
# echo $PORT
nc -zv 127.0.0.1 $PORT
