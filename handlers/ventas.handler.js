const { listarProductos, listarIngredientes, obtenerInventarioMoto, listarProductosIngredientes } = require("../controllers/ventas.controller");

const listarProductosHandler = async (req, res) => {
    try {
        console.log('PRODUCTOS');
        const response = await listarProductos();
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error en productos"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

const listarIngredientesHandler = async (req, res) => {
    try {
        console.log('INGREDIENTES');
        const response = await listarIngredientes();
        const ingredientes = response.map(ingrediente => {
            ingrediente.presed = false;
            return ingrediente;
        });
        if(response) res.status(200).json({status:'ok', data:ingredientes});
        else res.status(400).json({status:'fail',error: "Error en ingredientes"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

const listarProductosIngredientesHandler = async (req,res) => {
    try {
        const response = await listarProductosIngredientes();
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error en productosingredientes"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

const obtenerInventarioMotoHandler = async (req, res) => {
    try {
        const {moto,asignacion} = req.query;
        const response = await obtenerInventarioMoto(moto,asignacion);
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error en consulta"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

module.exports = {
    listarProductosHandler,
    listarIngredientesHandler,
    obtenerInventarioMotoHandler,
    listarProductosIngredientesHandler
}