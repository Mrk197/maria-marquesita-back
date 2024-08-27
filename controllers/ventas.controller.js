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
        const ingredientes = await BD._query("SELECT * FROM ingredientes WHERE estatus = 1");
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

async function obtenerExistenciasIngredientes(moto) {
    try {
        const params = [moto];
        const existenciasingredientes = await BD._query(`SELECT ei.*, i.nombre, i.medida
            FROM existenciasingredientes ei
            LEFT JOIN ingredientes i ON ei.ingrediente=i.id
            WHERE ei.almacen=?`, params);
        console.log('Existencias ', existenciasingredientes);
        return existenciasingredientes;
    } catch (error) {
        console.error('Error en obtenerExistenciasIngredientes:', error);
        return false;
    }
}

async function insertarExistenciaIngrediente(existencia, ingrdiente, moto) {
    try {
        console.log("params",existencia, ingrdiente, moto );
        const params = [existencia, ingrdiente, moto];
        const actualizado = await BD._query("UPDATE existenciasingredientes SET existencia=? WHERE ingrediente=? AND almacen=?", params);
        console.log("actualizado",actualizado.info);
        return {info: actualizado.info, affectedRows: actualizado.affectedRows}
    } catch (error) {
        return false;
    }
}

async function obtenerInventarioMoto(moto, asignacion) {
    try {
        const existenciasingredientes = await obtenerExistenciasIngredientes(moto);
        console.log('Existencias Moto ', existenciasingredientes);

        if (existenciasingredientes.length > 0) {
            const inserciones = existenciasingredientes.map(async (item) => {
                const params = [asignacion, item.ingrediente, item.existencia, item.existencia];
                const inventario = await BD._query("INSERT INTO inventariosmotos (asignacion, ingrediente, existenciainicio, existenciacalculada,existenciafin) VALUES (?, ?, ?, ?, 0)", params);
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

async function insertarVenta(venta) {
    console.log(venta);
    try {
        const retorno = await BD._query('INSERT INTO ventas SET asignacion=?, idapp=?, total=?, estatus=1', [venta.asignacion, venta.id, venta.total]);
        return {idServidor: retorno.insertId, idApp: venta.id};
    } catch (error) {
        console.log("Error al insertar venta",error);
        return false;
    }
}

async function insertarVentasProductos(ventasproductos) {
    try {
        const retorno = await BD._query('INSERT INTO ventasproductos SET ?', [ventasproductos]);
        return retorno.insertId;
    } catch (error) {
        console.log("Error al insertar venta",error);
        return false;
    }
}

async function insertarVentasIngredientes(ventasingredientes ) {
    try {
        const retorno = await BD._query('INSERT INTO ventasingredientes SET ?', [ventasingredientes ]);
        return retorno.insertId;
    } catch (error) {
        console.log("Error al insertar venta",error);
        return false;
    }
}

async function insertarVentaCumplimiento(ventaTotal, asignacion) {
    try {
        const params = [ventaTotal, ventaTotal, asignacion];
        const retorno = await BD._query("UPDATE asignaciones SET venta=?, cumplimiento=(? * 100)/cuota WHERE id=?", params);
        return retorno
    } catch (error) {
        console.log("Error al insertar VentaCumplimiento",error);
        return false;
    }
}

async function insertarInventarioMotoFinal(inventarioIngredientes) {
    try {
        const inserciones = inventarioIngredientes.map(async (item) => {
            const params = [item.existenciacalculada, item.existenciafin, item.asignacion, item.ingrediente];
            const inventario = await BD._query(
                "UPDATE inventariosmotos SET existenciacalculada=?, existenciafin=? WHERE asignacion=? AND ingrediente=?",
                params
            );
            return inventario;
        });

        // Espera a que todas las inserciones se completen
        const resultados = await Promise.all(inserciones);
        return resultados;
    } catch (error) {
        console.log('Error en insertarInventarioMotoFinal:', error);
        return false;
    }
}

module.exports = {
    listarProductos,
    listarIngredientes,
    obtenerInventarioMoto,
    listarProductosIngredientes,
    insertarVenta,
    insertarVentasProductos,
    insertarVentasIngredientes,
    obtenerExistenciasIngredientes,
    insertarExistenciaIngrediente,
    insertarVentaCumplimiento,
    insertarInventarioMotoFinal
}