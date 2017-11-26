var mysql = require('mysql');

/**
 * @class Query
 */
function Query() {
  this.connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'pi',
    password : '329db',
    database : 'smart_lock'
  });
  this.connection.connect();

  this.query = function(dbq, callback) {
    this.connection.query(dbq, function(err, rows, fields, dbq) {
      if(!err) {
        callback(0, rows);
      } else {
        callback(1, "Error: " + err);
      }
    });
  };
}

module.exports = new Query();
