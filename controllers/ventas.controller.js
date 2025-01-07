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

async function insertarVentasIngredientes(ventasingredientes,datosVenta) {
    try {
        const today = new Date(datosVenta.fechaAsignacion);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Se agrega 1 al mes porque los meses comienzan desde 0
        const day = String(today.getDate()).padStart(2, '0');
        const fecha = `${year}-${month}-${day}`;

        const retorno = await BD._query('INSERT INTO ventasingredientes SET ?', [ventasingredientes ]);
        const nota = `SALIDA VENTA ${datosVenta.vendedor} en ${datosVenta.lugar}`
        //registrar el movimiento del ingrediente
        //ventasingredientes.venta -> id de la venta
        const params = [
            ventasingredientes.venta, 
            "SALIDAV",
            fecha, 
            datosVenta.almacen, 
            ventasingredientes.ingrediente, 
            ventasingredientes.cantidad,
            nota,
            null,
            1
        ];
        const movimiento = await BD._query('INSERT INTO movimientosingredientes (idmovimiento,tipo,fecha,almacen,ingrediente,cantidad,notas,responsabilidad,estatus) VALUES (?,?,?,?,?,?,?,?,?)', params);
        return retorno.insertId;
    } catch (error) {
        console.log("Error al insertar venta",error);
        return false;
    }
}

async function insertarVentaCumplimiento(ventaTotal, asignacion) {
    try {
        const today = new Date(asignacion.fecha);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Se agrega 1 al mes porque los meses comienzan desde 0
        const day = String(today.getDate()).padStart(2, '0');
        const fecha = `${year}-${month}-${day}`;

        const params = [ventaTotal, ventaTotal, asignacion.id];
        const retorno = await BD._query("UPDATE asignaciones SET venta=?, cumplimiento=(? * 100)/cuota WHERE id=?", params);
        const descripcion = `VENTA ${asignacion.almacen}`
        //sumar venta del dia al saldo de la caja chica 
        const registroCuenta = await BD._query("UPDATE cuentas set saldo=saldo+? WHERE id=2",[ventaTotal]);
        console.log("REGISRO CUENTA", registroCuenta);
        
        //y registrar moviento en de dinero
        const params2 = [fecha,2,"INGRESO", 1,descripcion, ventaTotal,1];
        const registroMovimiento = await BD._query("INSERT INTO movimientosdinero (fecha,cuenta,tipo,concepto,descripcion,importe,estatus) VALUES (?,?,?,?,?,?,?)", params2);
        console.log(registroMovimiento);
        
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

async function consultaDeVentas(fechaInicio, fechaFin, vendedor) {
    try {
        const params = [vendedor,fechaInicio, fechaFin];
        const ventas = await BD._query("SELECT * FROM asignaciones WHERE vendedor=? AND fecha BETWEEN ? AND ?", params);
        console.log("VENTAS",ventas);
        return ventas;
        
    } catch (error) {
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
    insertarInventarioMotoFinal,
    consultaDeVentas
}