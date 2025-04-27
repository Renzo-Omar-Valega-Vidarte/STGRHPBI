const { sql } = require('../config/db');

async function getData(req, res) {
  try {
    const result = await sql.query(`
      SELECT
        [Ubigeo_Key],
        [UBIGEO_ID],
        [UBIGEO_RENIEC],
        [UBIGEO_INEI],
        [DEPARTAMENTO_INEI],
        [DEPARTAMENTO],
        [PROVINCIA_INEI],
        [PROVINCIA],
        [DISTRITO],
        [REGION],
        [MACROREGION_INEI],
        [MACROREGION_MINSA],
        [CODIGO_FIPS],
        [SUPERFICIE],
        [ALTITUD],
        [LATITUD],
        [LONGITUD],
        [POBLACION_DISTRITO],
        [POBLACION_PROVINCIA],
        [POBLACION_DEPARTAMENTO],
        [DIRESA]
      FROM [DWH_STGRHPBI].[Generico].[DIM_UBIGEO];
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error obteniendo datos de DIM_UBIGEO:', err);
    res.status(500).send('Error en el servidor');
  }
}

module.exports = { getData };
