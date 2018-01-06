var mysql = require('mysql');

/**
 * @class Query
 */
class Query {
  constructor(config) {
    this.setup(config);
  }

  query(qs) {
    const conn = this.connection;
    return new Promise(function(resolve, reject) {
      conn.query(qs, function(err, rows, fields, dbq) {
        if(err) {
          reject("Error: " + err);
          throw err;
        }
        resolve(rows);
      });
    });
  }

  change_config(config) {
    this.setup(config);
  }

  setup(config) {
    this.connection = mysql.createConnection(config);
    this.connection.connect(function(err) {
      if(err) {
        console.log('error: ' + err);
        return;
      }
      console.log('connected');
    });
  }
}

module.exports = Query;
