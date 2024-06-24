getconn = require('../config/connectdb.js');
 
var BD = new getconn();

async function listarProductos() {
    try {
        //const marquesitas = await BD._query("SELECT * FROM productos WHERE categoria=1 AND estatus = 1");
        //const crepas = await BD._query("SELECT * FROM productos WHERE categoria=2 AND estatus = 1");
        // return {
        //     marquesitas,
        //     crepas
        // }
        const productos = await BD._query("SELECT * FROM productos WHERE estatus = 1");
        return productos;
    } catch (error) {
        return false;
    }
};

async function listarIngredientes() {
    try {
        const ingredientes = await BD._query("SELECT * FROM ingredientes WHERE tipo=2 AND estatus = 1");
        return ingredientes;
    } catch (error) {
        return false;
    }
}

async function listarProductosIngredientes() {
    try {
        const productosingredientes = await BD._query("SELECT * FROM productosingredientes");
        return productosingredientes;
    } catch (error) {
        return false;
    }
}

async function obtenerInventarioMoto(moto, asignacion) {
    try {
        const params = [moto];
        const existenciasingredientes = await BD._query("SELECT * FROM existenciasingredientes WHERE almacen=?", params);
        console.log('Existencias ', existenciasingredientes);

        if (existenciasingredientes.length > 0) {
            const inserciones = existenciasingredientes.map(async (item) => {
                const params = [asignacion, item.ingrediente, item.existencia, item.existencia];
                const inventario = await BD._query("INSERT INTO inventariosmotos (asignacion, ingrediente, existenciainicio, existenciacalculada) VALUES (?, ?, ?, ?)", params);
                //console.log("Inventario", inventario);
                return inventario;
            });

            // Espera a que todas las inserciones se completen
            await Promise.all(inserciones);
        }

        return existenciasingredientes;
    } catch (error) {
        console.error('Error en obtenerInventarioMoto:', error);
        return false;
    }
}


module.exports = {
    listarProductos,
    listarIngredientes,
    obtenerInventarioMoto,
    listarProductosIngredientes
}