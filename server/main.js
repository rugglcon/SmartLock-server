let express = require('express'),
  request = require('request'),
  auth = require('./utils/auth.js'),
  Query = require('./utils/query.js');

let app = express();
let db = new Query({
  host: 'localhost',
  user: 'pi',
  password: '329db',
  database: 'smart_lock'
});

function handle_res(res, err, data) {
  if(!err) {
    res.send(JSON.stringify({error: 0, data: data}));
  } else {
    res.send(JSON.stringify({error: err, data: data}));
  }
}

app.get('/open_lock', function(req, res) {
  auth.use_lock(req.query.user_id, req.query.lock_id, 'U', db)
  .then(function(data) {
    return db.query("select * from Locks where id = " + req.query.lock_id);
  })
  .then(function(data) {
    const lock_ip = data[0].IP;
    request('http://' + lock_ip + ':8000/open_lock',
      function(error, resp, body) {
        handle_res(res, error, body);
      }
    );
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  });
});

app.get('/close_lock', function(req, res) {
  auth.use_lock(req.query.user_id, req.query.lock_id, 'L', db)
  .then(function(data) {
    return db.query("select * from Locks where id = " + req.query.lock_id);
  })
  .then(function(data){
    const lock_ip = data[0].IP;
    request('http://' + lock_ip + ':8000/close_lock',
      function(error, resp, body) {
        handle_res(res, error, body);
      }
    );
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  })
});

app.get('/login', function(req, res) {
  auth.login(req.query.email, req.query.password, db)
  .then(function(data) {
    handle_res(res, data.err, data.data);
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  });
});

app.get('/signup', function(req, res) {
  auth.create_account(req.query.email, req.query.password, db)
  .then(function(data) {
    handle_res(res, data.err, data.data);
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  });
});

app.get('/add_user_to_lock', function(req, res) {
  auth.add_user_to_lock(req.query.owner_id, req.query.user_id, req.query.lock_id, db)
  .then(function(data) {
    handle_res(res, data.err, data.data);
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  });
});

app.get('/num_inside_users', function(req, res) {
  auth.get_inside(req.query.user_id)
  .then(function(data) {
    handle_res(res, data.err, data.data);
  })
  .catch(function(data) {
    handle_res(res, data.err, data.data);
  });
});

app.listen(8080, '0.0.0.0', function() {
});
