const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log('Conectado exitosamente a SQL Server 🎯');
  } catch (err) {
    console.error('Error conectando a SQL Server:', err);
  }
}

module.exports = { sql, connectDB };
