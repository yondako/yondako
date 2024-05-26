#!/bin/sh

openssl genrsa 2048 > server.key
openssl req -new -key server.key -subj "/C=JP/ST=Some-State/O=Some-Org/CN=local.yondako.com" > server.csr
openssl x509 -days 3650 -req -extfile san.txt -signkey server.key < server.csr > local.yondako.com.crt

