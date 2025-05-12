const { poolPromise } = require('../config/db');

async function getFactGastos(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        f.MONTO_PIA,
        f.MONTO_EJECUCION,
        d.ANIO,
        u.DEPARTAMENTO,
        g.GENERICA_NOMBRE
      FROM [Gastos].[FACT_GASTOS] f
      INNER JOIN [Generico].[DIM_FECHA] d
        ON f.Fecha_Key = d.Fecha_Key
      INNER JOIN [Generico].[DIM_UBIGEO] u
        ON f.UBIGEO_Key = u.UBIGEO_Key
      INNER JOIN [Gastos].[DIM_GENERICA] g
        ON f.Generica_Key = g.Generica_Key
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimFecha(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Generico].[DIM_FECHA]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ... repeat the same pattern for each dimension/table ...
async function getDimActividad(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_ACTIVIDAD]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimCategoria(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_CATEGORIA]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimDivisionFuncional(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_DIVISION_FUNCIONAL]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimEjecutora(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_EJECUTORA]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimFinanciamiento(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_FINANCIAMIENTO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimFuncion(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_FUNCION]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimGenerica(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_GENERICA]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimGrupoEntidad(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_GRUPO_ENTIDAD]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimGrupoFuncional(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_GRUPO_FUNCIONAL]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimMeta(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_META]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimProductoProyecto(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_PRODUCTO_PROYECTO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimProgramaPresupuesto(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_PROGRAMA_PRESUPUESTO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimRubro(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_RUBRO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimSecEjec(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_SEC_EJEC]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimSecFunc(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_SEC_FUNC]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimTipoProyecto(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_TIPO_PROYECTO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimTipoTransaccion(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Gastos].[DIM_TIPO_TRANSACCION]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ATM schema
async function getFactATM(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Atm].[FACT_ATM]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimMunicipalidad(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Atm].[DIM_MUNICIPALIDAD]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDimUbicacionATM(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Atm].[DIM_UBICACION_ATM]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Enapres schema
async function getFactEnapres(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Enapres].[FACT_ENAPRES]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Generic
async function getDimUbigeo(req, res) {
  try {
    const pool   = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [Generico].[DIM_UBIGEO]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getFactGastos,
  getDimFecha,
  getDimActividad,
  getDimCategoria,
  getDimDivisionFuncional,
  getDimEjecutora,
  getDimFinanciamiento,
  getDimFuncion,
  getDimGenerica,
  getDimGrupoEntidad,
  getDimGrupoFuncional,
  getDimMeta,
  getDimProductoProyecto,
  getDimProgramaPresupuesto,
  getDimRubro,
  getDimSecEjec,
  getDimSecFunc,
  getDimTipoProyecto,
  getDimTipoTransaccion,
  getFactATM,
  getDimMunicipalidad,
  getDimUbicacionATM,
  getFactEnapres,
  getDimUbigeo
};


