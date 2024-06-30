const { listarProductos, listarIngredientes, obtenerInventarioMoto, listarProductosIngredientes, obtenerExistenciasIngredientes, insertarExistenciaIngrediente, insertarVenta, insertarVentasProductos, insertarVentasIngredientes, insertarVentaCumplimiento } = require("../controllers/ventas.controller");

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

const consultarExistenciasIngredientes = async (req, res) => {
    const {moto} = req.query;
    try {
        const response = await obtenerExistenciasIngredientes(moto);
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error al consultar existenciasingredientes"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

const insertarExistenciaIngredienteHandler = async (req, res) => {
    const {data, moto} = req.body;
    try {
        const inserciones = data?.map(async existenciaing => {
            return await insertarExistenciaIngrediente(existenciaing.existenciaFin, existenciaing.ingrediente, moto);
        });
        const resultados = await Promise.all(inserciones);
        res.status(200).json({ status: 'ok', data: resultados });
        //const response = await insertarExistenciaIngrediente(existencia, ingrediente, moto);
        //if(response) res.status(200).json({status:'ok', data:response});
        //else res.status(400).json({status:'fail',error: "Error al insertar existenciaingrediente"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

const insertarVentasDelDiaHandler = async (req, res) => {
    const {ventas, ventasproductos, ventasingredientes} = req.body;
    try {
        const insercionesVentas = ventas?.map(async venta => {
            return await insertarVenta(venta);
        });
        const resultadosVentas = await Promise.all(insercionesVentas);
        console.log(resultadosVentas);

        console.log("ventasproductos ",ventasproductos);

        //una vez que ya se insertaron las ventas, insertar cada ventaproducto y obtener el idServidor filtrando el idApp
        const insercionesVentasProductos = ventasproductos?.map(async ventaproducto => {
            const ids = resultadosVentas.find(resultado => resultado.idApp === ventaproducto.venta);
            console.log("idServidor", ids);
            ventaproducto.venta = ids.idServidor;
            return await insertarVentasProductos(ventaproducto);
        });
        const resultadosVentasProductos = await Promise.all(insercionesVentasProductos);
        console.log("resultadosVentasProductos", resultadosVentasProductos);

        const insercionesVentasIngredientes = ventasingredientes?.map(async ventaingrediente => {
            const ids = resultadosVentas.find(resultado => resultado.idApp === ventaingrediente.venta);
            console.log("idServidor ingrediente", ids);
            ventaingrediente.venta = ids.idServidor;
            return await insertarVentasIngredientes(ventaingrediente);
        });
        const resultadosVentasIngredientes = await Promise.all(insercionesVentasIngredientes);
        console.log("resultadosVentasIngredientes", resultadosVentasIngredientes);

        res.status(200).json({ 
            status: 'ok', 
            resultadosVentas,
            resultadosVentasProductos,
            resultadosVentasIngredientes 
        });

    } catch (error) {
        console.log("Error al subir venta", error);
        res.status(400).json({status:'fail',error: error.message});
    }
};

const insertarVentaCumplimientoHandler = async (req, res) => {
    const {ventaTotal, asignacion} = req.body;
    try {
        const response = await insertarVentaCumplimiento(ventaTotal, asignacion);
        console.log("response cumplimiento",response);
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error al insertar venta cumplimiento"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
};

module.exports = {
    listarProductosHandler,
    listarIngredientesHandler,
    obtenerInventarioMotoHandler,
    listarProductosIngredientesHandler,
    consultarExistenciasIngredientes,
    insertarExistenciaIngredienteHandler,
    insertarVentasDelDiaHandler,
    insertarVentaCumplimientoHandler
}