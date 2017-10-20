#!/usr/bin/python

"""
very simple socket server setup
"""
import socket

s = socket.socket()
host = 'se329server-pi.local'
port = 12345
s.bind((host, port))

s.listen(5)
while True:
    c, addr = s.accept()
    print('got connection from', addr)
    c.send('thank you for connecting')
    c.close()
