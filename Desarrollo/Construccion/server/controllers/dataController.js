const { poolPromise } = require('../config/db');

// Función genérica
const fetchTable = async (schema, table, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM [${schema}].[${table}]`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paginación específica para FACT_GASTOS
const getFactGastos = async (req, res) => {
  try {
    const pool = await poolPromise;

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controladores genéricos
const getDimFecha = (req, res) => fetchTable('Generico', 'DIM_FECHA', res);
const getDimActividad = (req, res) => fetchTable('Gastos', 'DIM_ACTIVIDAD', res);
const getDimCategoria = (req, res) => fetchTable('Gastos', 'DIM_CATEGORIA', res);
const getDimDivisionFuncional = (req, res) => fetchTable('Gastos', 'DIM_DIVISION_FUNCIONAL', res);
const getDimEjecutora = (req, res) => fetchTable('Gastos', 'DIM_EJECUTORA', res);
const getDimFinanciamiento = (req, res) => fetchTable('Gastos', 'DIM_FINANCIAMIENTO', res);
const getDimFuncion = (req, res) => fetchTable('Gastos', 'DIM_FUNCION', res);
const getDimGenerica = (req, res) => fetchTable('Gastos', 'DIM_GENERICA', res);
const getDimGrupoEntidad = (req, res) => fetchTable('Gastos', 'DIM_GRUPO_ENTIDAD', res);
const getDimGrupoFuncional = (req, res) => fetchTable('Gastos', 'DIM_GRUPO_FUNCIONAL', res);
const getDimMeta = (req, res) => fetchTable('Gastos', 'DIM_META', res);
const getDimProductoProyecto = (req, res) => fetchTable('Gastos', 'DIM_PRODUCTO_PROYECTO', res);
const getDimProgramaPresupuesto = (req, res) => fetchTable('Gastos', 'DIM_PROGRAMA_PRESUPUESTO', res);
const getDimRubro = (req, res) => fetchTable('Gastos', 'DIM_RUBRO', res);
const getDimSecEjec = (req, res) => fetchTable('Gastos', 'DIM_SEC_EJEC', res);
const getDimSecFunc = (req, res) => fetchTable('Gastos', 'DIM_SEC_FUNC', res);
const getDimTipoProyecto = (req, res) => fetchTable('Gastos', 'DIM_TIPO_PROYECTO', res);
const getDimTipoTransaccion = (req, res) => fetchTable('Gastos', 'DIM_TIPO_TRANSACCION', res);

const getFactATM = (req, res) => fetchTable('Atm', 'FACT_ATM', res);
const getDimMunicipalidad = (req, res) => fetchTable('Atm', 'DIM_MUNICIPALIDAD', res);
const getDimUbicacionATM = (req, res) => fetchTable('Atm', 'DIM_UBICACION_ATM', res);

const getFactEnapres = (req, res) => fetchTable('Enapres', 'FACT_ENAPRES', res);
const getDimUbigeo = (req, res) => fetchTable('Generico', 'DIM_UBIGEO', res);

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
