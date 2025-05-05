const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/dataController');

// Rutas para cada controlador
router.get('/fact-gastos', getFactGastos);
router.get('/dim-fecha', getDimFecha);
router.get('/dim-actividad', getDimActividad);
router.get('/dim-categoria', getDimCategoria);
router.get('/dim-division-funcional', getDimDivisionFuncional);
router.get('/dim-ejecutora', getDimEjecutora);
router.get('/dim-financiamiento', getDimFinanciamiento);
router.get('/dim-funcion', getDimFuncion);
router.get('/dim-generica', getDimGenerica);
router.get('/dim-grupo-entidad', getDimGrupoEntidad);
router.get('/dim-grupo-funcional', getDimGrupoFuncional);
router.get('/dim-meta', getDimMeta);
router.get('/dim-producto-proyecto', getDimProductoProyecto);
router.get('/dim-programa-presupuesto', getDimProgramaPresupuesto);
router.get('/dim-rubro', getDimRubro);
router.get('/dim-sec-ejec', getDimSecEjec);
router.get('/dim-sec-func', getDimSecFunc);
router.get('/dim-tipo-proyecto', getDimTipoProyecto);
router.get('/dim-tipo-transaccion', getDimTipoTransaccion);

router.get('/fact-atm', getFactATM);
router.get('/dim-municipalidad', getDimMunicipalidad);
router.get('/dim-ubicacion-atm', getDimUbicacionATM);

router.get('/fact-enapres', getFactEnapres);

router.get('/dim-ubigeo', getDimUbigeo);

module.exports = router;
