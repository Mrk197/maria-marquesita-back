const { Router } = require("express");
const { 
    listarProductosHandler, 
    listarIngredientesHandler, 
    obtenerInventarioMotoHandler, 
    listarProductosIngredientesHandler,
    consultarExistenciasIngredientes,
    insertarExistenciaIngredienteHandler,
    insertarVentasDelDiaHandler,
    insertarVentaCumplimientoHandler,
    insertarInventarioMotoFinalHandler,
    obtenerConsultaDeVentasHandler,
    insertarInventarioMotoHandler,
} = require("../handlers/ventas.handler");

const router = Router();

router.get('/productos', listarProductosHandler);
router.get('/ingredientes', listarIngredientesHandler);
router.get('/productosingredientes', listarProductosIngredientesHandler);
router.get('/inventarioMoto', obtenerInventarioMotoHandler);
router.get('/existenciasingredientes', consultarExistenciasIngredientes);
router.post('/existenciasingredientes', insertarExistenciaIngredienteHandler);
router.post('/ventasDelDia', insertarVentasDelDiaHandler);
router.post('/ventaCumplimiento', insertarVentaCumplimientoHandler);
router.put('/inventarioMoto', insertarInventarioMotoFinalHandler);
router.post('/ventasDia', obtenerConsultaDeVentasHandler);
router.post('/inventarioMoto', insertarInventarioMotoHandler);

module.exports = router;