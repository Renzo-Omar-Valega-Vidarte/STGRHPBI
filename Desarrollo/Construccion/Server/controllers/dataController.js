const { poolPromise } = require('../config/db');

const getData = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT TOP 10 * FROM [Gastos].[FACT_GASTOS]'); // 👈 Aquí ahora consulta la tabla correcta
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getData
};

