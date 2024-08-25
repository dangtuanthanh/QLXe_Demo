
const sql = require('mssql');
require('dotenv').config();
const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database,
  options: {
    trustedconnection: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "",
  },
  port: 1433
};

let pool;

async function connect() {
  pool = new sql.ConnectionPool(config);
  await pool.connect();
  console.log('Đã kết nối tới Cơ Sở Dữ Liệu');
}

connect();

module.exports = {
  getPool: () => {
    return pool;
  }
}

