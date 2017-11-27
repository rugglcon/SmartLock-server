var query = require('./query.js');

function Auth() {
	this.login = function (email, passwd, callback) {
		query.query("select id from Users where email = '" + email + "' and password = '" + passwd + "'", function(err, data) {
				if(!err) {
					if(data.length == 0) {
						return callback(2, "No user with that email or password");
					}
					callback(0, data[0].id);
				} else {
					return callback(err, "Error: " + data);
				}
			});
	};

	this.use_lock = function(user_id, lock_id, oper, callback) {
		query.query("select lock_id from Perms where user_id = '" + user_id + "' and lock_id = '" + lock_id + "'", function(err, data) {
			if(!err) {
				if(data.length == 0) {
					return callback(2, "User " + user_id + " doesn't have permissions for lock " + lock_id);
				}
				query.query("insert into Ops (user_id, lock_id, time, op) values ('" + user_id + "', '" + lock_id + "', '" + Date.now() + "', '" + oper + "'",
				function(err, data) {
					if(!err) {
						query.query("insert into Locks columns (state) values ('" + oper + "') where id = '" + lock_id + "'", function(err, data) {
							if(err) {
								return callback(err, "Error: " + data);
							} else {
								callback(0, data);
							}
						});
					} else {
						return callback(err, "Error: " + data);
					}
				});
			} else {
				return callback(err, "Error: " + data);
			}
		});
	};

	this.add_user_to_lock = function(owner_id, user_id, lock_id, callback) {
		query.query("select * from Locks where id = '" + lock_id + "' and owner_id = '" + owner_id + "'", function(err, data) {
			if(!err) {
				if(data.length == 0) {
					return callback(2, "Wrong owner for lock " + lock_id);
				}
				query.query("select * from Perms where lock_id = '" + lock_id + "' and user_id = '" + user_id + "'", function(err, data) {
					if(!err) {
						if(data.length == 0) {
							query.query("insert into Perms columns (lock_id, user_id) values ('" + lock_id + "', '" + user_id + "')", function(err, data) {
								if(err) {
									return callback(err, "Error: " + data);
								}
							});
						}
					}
				});
			} else {
				return callback(err, "Error: " + data);
			}
		});
	};

	this.create_account = function(email, passwd, callback) {
		query.query("select * from Users where email = '" + email + "'",
		function(err, data) {
			if(!err) {
				if(data.length == 0) {
					query.query("insert into Users columns (email, password) values ('" + email + "', '" + passwd + "')", function(err, data) {
						if(err) {
							return callback(err, "Error: " + data);
						} else {
							this.login(email, passwd, function(err, data) {
								if(err) {
									return callback(err, "Error: " + data);
								} else {
									callback(0, data);
								}
							});
						}
					});
				} else {
					return callback(2, "User already exists with email " + email);
				}
			}
		});
	};
}

module.exports = new Auth();