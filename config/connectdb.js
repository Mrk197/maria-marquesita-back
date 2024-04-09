const config = require('./conf.js');

class connectiondb {
  /**
   * @param {string} query [Required]
   */

  async _query(query, params) {
    if (query == undefined) {
      console.log("value type and nameconn  is requerid for a sqlconnections");
      app.use(bodyParser());
    }
    const mysql = require("mysql2/promise");

    const pool = mysql.createPool(config.databasedev());
    const [rows] = await pool.query(query, params);
    await pool.end();
    return rows;
  }
}
module.exports = connectiondb;
