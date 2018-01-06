const Query = require('./query.js');

module.exports.login = function (email, passwd, db) {
  return new Promise(function(resolve, reject) {
    let usr_id = -1;
    db.query("select * from Users where email = '" + email + "' and password = '" + passwd + "'")
    .then(function(data) {
      if(data.length == 0) {
        reject({
          err: 2,
          data: "No user with that email or password"
        });
      }
      usr_id = data[0].id;
      return db.query("select lock_id from Perms where user_id = " + data[0].id);
    })
    .then(function(data) {
      let usr_lock = -1;
      if(data.length > 0) {
        usr_lock = data[0].lock_id;
      }
      const usr_data = {
        "user_id": usr_id,
        "lock_id": usr_lock
      };
      resolve({
        err: 0,
        data: usr_data
      });
    })
    .catch(function(data) {
      console.log(data);
      reject({
        err: 1,
        data: data
      });
    });
  });
};

module.exports.use_lock = function(user_id, lock_id, oper, db) {
  return new Promise(function(resolve, reject) {
    db.query("select lock_id from Perms where user_id = " + user_id + " and lock_id = " + lock_id)
    .then(function(data) {
      if(data.length == 0) {
        reject({
          err: 2,
          data: "User " + user_id + " doesn't have permissions for lock " + lock_id
        });
      }
      return db.query("insert into Ops (user_id, lock_id, time, op) values ('" + user_id + "', '" + lock_id + "', NOW(), '" + oper + "')");
    })
    .then(function(data) {
      return db.query("update Locks set state = '" + oper + "' where id = " + lock_id);
    }).then(function(data) {
      resolve({
        err: 0,
        data: data
      });
    }).catch(function(data) {
      reject({
        err: 1,
        data: data
      });
    });
  });
};

module.exports.add_user_to_lock = function(owner_id, user_id, lock_id, db) {
  return new Promise(function(resolve, reject) {
    db.query("select * from Locks where id = '" + lock_id + "' and owner_id = '" + owner_id + "'")
    .then(function(data) {
      if(data.length == 0) {
        reject({
          err: 2,
          data: "Wrong owner for lock " + lock_id
        });
      }
      return db.query("select * from Perms where lock_id = '" + lock_id + "' and user_id = '" + user_id + "'");
    })
    .then(function(data) {
      if(data.length == 0) {
        return db.query("insert into Perms (lock_id, user_id) values (" + lock_id + ", " + user_id + ")");
      } else {
        reject({
          err: 2,
          data: "User already has permissions for this lock."
        });
      }
    })
    .then(function(data) {
      resolve({
        err: 0,
        data: "Successfully added user to lock."
      });
    })
    .catch(function(data) {
      reject({
        err: 1,
        data: data
      });
    });
  });
};

module.exports.create_account = function(email, passwd, db) {
  return new Promise(function(resolve, reject) {
    db.query("select * from Users where email = '" + email + "'")
    .then(function(data) {
      if(data.length == 0) {
        return db.query("insert into Users (email, password) values ('" + email + "', '" + passwd + "')");
      } else {
        reject({
          err: 2,
          data: "User already exists with that email."
        });
      }
    })
    .then(function(data) {
      return module.exports.login(email, passwd, db);
    })
    .then(function(data) {
      resolve({
        err: 0,
        data: data
      });
    })
    .catch(function(data) {
      reject({
        err: 1,
        data: data
      });
    });
  });
};

module.exports.get_inside = function(user_id, db) {
  return new Promise(function(resolve, reject) {
    db.query("select * from Users where id = " + user_id)
    .then(function(data) {
      if(data.length == 0) {
        reject({
          err: 2,
          data: "User with id " + user_id + " does not exist."
        });
      } else {
        return db.query("select count(inside) as count from Users where inside = 1")
      }
    })
    .then(function(data) {
      resolve({
        err: 0,
        data: data[0].count
      });
    })
    .catch(function(data) {
      reject({
        err: 1,
        data: data
      });
    });
  });
};
