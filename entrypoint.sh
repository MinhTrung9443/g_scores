#!/bin/bash
set -e

echo "Starting MariaDB..."
/etc/init.d/mariadb start

echo "Waiting for MariaDB to be ready..."
while ! mysqladmin ping -h"127.0.0.1" --silent; do
    sleep 1
done

echo "MariaDB is up and running!"

echo "Starting Node.js Backend..."
cd /app/backend
exec npm start
