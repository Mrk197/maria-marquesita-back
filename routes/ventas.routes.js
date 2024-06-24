const { Router } = require("express");
const { 
    listarProductosHandler, 
    listarIngredientesHandler, 
    obtenerInventarioMotoHandler, 
    listarProductosIngredientesHandler
} = require("../handlers/ventas.handler");

const router = Router();

router.get('/productos', listarProductosHandler);
router.get('/ingredientes', listarIngredientesHandler);
router.get('/productosingredientes', listarProductosIngredientesHandler);
router.get('/inventarioMoto', obtenerInventarioMotoHandler);

module.exports = router;