# Smart Lock

Secure, automated locking system controllable with a mobile app.

## NAT Router Basics

Although NAT routers are not generally purchased for their security benefits, all NAT routers inherently function as very effective hardware firewalls (with a few caveats examined below). As a hardware firewall they prevent "unsolicited", unexpected, unwanted, and potentially annoying or dangerous traffic from the public Internet from passing through the router and entering the user's private LAN network.

The reason they do this is very simple: With multiple "internal" computers on the LAN behind the router, the router must know which internal computer should receive each incoming packet of data. Since _all_ incoming packets of data have the same IP address (the single IP address of the router), the only way the router knows which computer should receive the incoming packet is if one of the internal computers on the private LAN _first_ sent data packets out to the source of the returning packets.

How is this done? Since the NAT router links the internal private network to the Internet, it sees everything sent out to the Internet by the computers on the LAN. It memorizes each outgoing packet's destination IP and port number in an internal "connections" table and assigns the packet its own IP and one of its own ports for accepting the return traffic. Finally, it records this information, along with the IP address of the internal machine on the LAN that sent the outgoing packet, in a "current connections" table.

When any incoming packets arrive at the router from the Internet, the router scans its "current connections" table to see whether this data is expected by looking for the remote IP and port number in the current connections table. If a match is found, the table entry also tells the router which computer in the private LAN is expecting to receive the incoming traffic from that remote address. So the router re-addresses (translates) the packet to that internal machine and sends it into the LAN.

If the arriving packet does not exactly match traffic that is currently expected by the router, the router figures that it's just unwanted "Internet noise" and discards the unsolicited packet of data.

If the NAT router isn't already expecting the incoming data, because one of the machines on the LAN asked for it from the Internet, the router silently discards it and your private network is never bothered. 
