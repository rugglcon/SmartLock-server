# Smart Lock

Secure, automated locking system controllable with a mobile app.

[Smart Lock lock](https://github.com/rugglcon/SmartLock-lock)

[Smart Lock app](https://github.com/rugglcon/SmartLock-app)

## Running the server

Run `npm start` in the top level of the directory. The server will then be started on port 8080, or whichever port you choose to use by editing `server/main.js` on this line: 
`app.listen(8080, '0.0.0.0', function() {`

Another thing you could have to change for actual implementation is the IP address of the locks on the lines that have:
`request.get('http://0.0.0.0:8000')` inside of `server/main.js`.

Documentation on the REST API can be found [here](https://github.com/rugglcon/SmartLock-server/wiki/API-Documentation)
