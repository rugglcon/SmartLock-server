"""
The device client is used to allow incoming connections from the remote server.

This is accomplished by establishing a light-weight protocol to determine if a
connection should be made and a negotiation of the port to use.

Protocol:
  1. Device: SYN: Should a connection be established?
  2a. Server: SYN-ACK: Yes > A connection should be made.
    2b. Server: No > The connection is ended.
  3a. Device: ACK: Send TCP connection information (address and port)
    3b. Device: Allow incoming traffic (NAT Traversal) via UDP.
"""

import json
import socket
import sys

# TODO: determine private IP automatically
TCP_HOST = '10.0.2.15'
TCP_PORT = 10000
# TODO: domain name of remote server
REMOTE_HOST = '192.168.1.17'
REMOTE_PORT = 10001

syn_data = {
    'tcp-host': TCP_HOST,
    'tcp-port': TCP_PORT,
    'send-syn': False
}

# create a UDP/IP socket; IPv4, UDP
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# address of the remote server
remote_server_address = (REMOTE_HOST, REMOTE_PORT)

try:

    # send initial UDP packet to remote server and wait for response
    print('Sending UDP packet to host: %s, port: %s' % remote_server_address)
    sock.sendto(json.dumps(syn_data), remote_server_address)
    print('Waiting for response...')

    while True:

        data, address = sock.recvfrom(1046)
        print('Received %s bytes from %s. data: %s'
              % (len(data), address, data))

        if data:
            try:
                data = json.loads(data)
            except ValueError as e:
                print(sys.stderr, 'Error: %s', e)
                continue
        else:
            continue

        if data.get('should-respond', None) is True:
            sock.close()
            syn_data['send-syn'] = True
            # send UDP packet to initiate TCP connection
            print('Initiate TCP connection with host: %s, port: %s'
                  % remote_server_address)
            # negotiate TCP socket port; bind to port on which the future TCP
            # connection will be established
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.bind((TCP_HOST, TCP_PORT))
            print('UDP hole punching on host: %s, port: %s'
                  % (TCP_HOST, TCP_PORT))
            sock.sendto(json.dumps(syn_data), remote_server_address)
            break

finally:
    sock.close()

# create a TCP/IP socket; IPv4, TCP
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# address of the local server
server_address = (TCP_HOST, TCP_PORT)
print('Starting server on host: %s, port: %s' % server_address)

try:
    sock.bind(server_address)
    # listen for incoming connections
    sock.listen(1)
    print('Server listening on port: %s' % server_address[1])
except socket.error as e:
    print(sys.stderr, 'Error: %s', e)
    sock.close()
    sys.exit(1)

while True:

    # wait for connection from remote server
    print('Waiting for response...')
    connection, client_address = sock.accept()

    try:

        print('Connection from host: %s, port: %s' % client_address)

        # receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(64)
            print('Received %s bytes from %s. data: %s' % (
                len(data), client_address, data))

            if data:
                print('Echoing data back to client')
                connection.sendall(data)
            else:
                print('Empty buffer')
                break

    finally:
        connection.close()
        sock.close()

print('TCP session has been terminated.')
sys.exit(0)
