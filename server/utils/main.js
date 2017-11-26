var query = require('./query.js');
var auth = require('./auth.js');

auth.login('email@email.com', 'password', function(err, data) {
	if(!err) {
		console.log(data);
	} else {
		console.log(data);
	}
});
