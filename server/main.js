var express = require('express'),
  query = require('./utils/query.js'),
  auth = require('./utils/auth.js');
var app = express();

function handle_res(res, err, data) {
  if(!err) {
    res.send(JSON.stringify({error: 0, data: data}));
  } else {
    res.send(JSON.stringify({error: err, data: data}));
  }
}

app.get('/open_lock', function(req, res) {
  auth.use_lock(req.query.user_id, req.query.lock_id, 'U',
    function(err, data) {
      handle_res(res, err, data);
    });
});

app.get('/close_lock', function(req, res) {
  auth.use_lock(req.query.user_id, req.query.lock_id, 'L',
    function(err, data) {
      handle_res(res, err, data);
    });
});

app.get('/login', function(req, res) {
  auth.login(req.query.email, req.query.password,
    function(err, data) {
      handle_res(res, err, data);
    });
});

app.get('/signup', function(req, res) {
  auth.create_account(req.query.email, req.query.password,
    function(err, data) {
      handle_res(res, err, data);
    });
});

app.get('/add_user_to_lock', function(req, res) {
  auth.add_user_to_lock(req.query.owner_id, req.query.user_id, req.query.lock_id,
    function(err, data) {
      handle_res(res, err, data);
    });
});

app.listen(8080, '0.0.0.0', function() {
  console.log('listening on port 8080');
});