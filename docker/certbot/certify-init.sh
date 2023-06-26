#!/bin/sh

set -e

echo "Getting certificate..."

certbot certonly \
    --webroot \
    --webroot-path "/var/www/" \
    -d "www.plantsearcher.net" \
    --email "rboothv5@gmail.com" \
    --rsa-key-size 4096 \
    --agree-tos \
    --noninteractive \
    