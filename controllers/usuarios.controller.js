getconn = require('../config/connectdb.js');
 
var BD = new getconn();

async function listarUsuarios() {
    const usuarios = await BD._query("SELECT * FROM vendedores WHERE estatus = 1")
        .then(data => {
            return data;
        }).catch(err =>{
            console.log("Error", err);
            return false;
        });
    if(usuarios) return usuarios;
    else throw new Error("Error al hacer la consulta");
}

async function validarUsuario(usuario, clave) {
    console.log(usuario, clave);
    const params = [usuario, clave];
    try {
        const validado = await BD._query("SELECT id, nombre, usuario, clave FROM vendedores WHERE usuario = ? AND clave = ? AND estatus = 1", params);
        console.log("validarUsuario", validado);
        return validado;
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

async function registrarAsistencia(usuario, tipo, id, notas) {
    console.log("Datos registrarAsistencia",usuario, tipo, id, notas);
    let horast= [];
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Se agrega 1 al mes porque los meses comienzan desde 0
    const day = String(today.getDate()).padStart(2, '0');
    const fecha = `${year}-${month}-${day}`;
    const hora = today.getHours();
    const minutos = today.getMinutes();
    const segundos = today.getSeconds();
    const tiempo = hora+":"+minutos+":"+segundos;
    try {
        // const asistencia = await BD._query("INSERT INTO asistencia (vendedor,fecha,hora,tipo,estatus) VALUES (?,?,?,?,1)", params);
        // console.log("ASISTENCIA", asistencia);
        if (tipo === 'ENTRADA') {
            const asistencia = await BD._query("UPDATE asignaciones SET entrada=? WHERE id=?", [tiempo, id]);
            console.log("ASISTENCIA-ENTRADA", asistencia);
        }
        else if(tipo === 'ENTRADA-INVENTARIO'){
            const asistencia = await BD._query("UPDATE asignaciones SET estatus=2,notasinventario=?  WHERE id=?", [notas,id]);
            console.log("ASISTENCIA-INVENTARIO", asistencia);
        }
        else if (tipo === 'ENTRADA-DILIGENCIA') {
            const asistencia = await BD._query("UPDATE asignaciones SET estatus=2,entrada=? WHERE id=?", [tiempo, id]);
            console.log("ASISTENCIA-ENTRADA", asistencia);
        }
        else{
            const asistencia = await BD._query("UPDATE asignaciones SET salida=?, estatus=3, notasinventario=? WHERE id=?", [tiempo, notas, id]);
            horast =  await BD._query("SELECT id,fecha,entrada,salida, TIMEDIFF(salida, entrada) as tiempodif FROM asignaciones WHERE id=?", [id]);
            console.log("ASISTENCIA-SALIDA", asistencia);
        }
        return {fecha, tiempo, horast};
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

async function registrarHorasTrabajadas(id, horas) {
    try {
        const horastrabajadas = await BD._query("UPDATE asignaciones SET horastrabajadas=? WHERE id=?", [horas, id]);
        console.log("horastrabajadas", horastrabajadas);
    } catch (error) {
        return false;
    }
}

async function obtenerAsignacion(usuario) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Se agrega 1 al mes porque los meses comienzan desde 0
    const day = String(today.getDate()).padStart(2, '0');
    const fecha = `${year}-${month}-${day}`;
    try {
        const params = [fecha, usuario]
        // const asignacion = await BD._query(`SELECT a.*, al.nombre AS nombreAlmacen, l.nombre AS nombreLugar 
        //     FROM asignaciones a 
        //     LEFT JOIN almacenes al ON a.almacen=al.id 
        //     LEFT JOIN lugares l ON a.lugar=l.id 
        //     WHERE a.fecha=? AND a.vendedor=? AND a.estatus=1;`, params);
        const asignacion = await BD._query("SELECT * FROM asignacioneslistado WHERE fecha=? AND idvendedor=? AND estatus=1", params);
        console.log('ASIGNACION', asignacion);
        return asignacion;
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

module.exports = {
    listarUsuarios,
    validarUsuario,
    registrarAsistencia,
    obtenerAsignacion,
    registrarHorasTrabajadas
}
