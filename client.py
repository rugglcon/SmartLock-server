#!/usr/bin/python

import socket

s = socket.socket()
host = 'se329server-pi.local'
port = 12345
s.connect((host, port))
print(s.recv(1024))
s.close()
