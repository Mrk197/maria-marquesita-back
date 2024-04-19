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

async function registrarEntrada(usuario) {
    console.log(usuario);
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
    const params = [usuario,fecha,tiempo, 'ENTRADA'];
    try {
        const asistencia = await BD._query("INSERT INTO asistencia (vendedor,fecha,hora,tipo,estatus) VALUES (?,?,?,?,1)", params);
        console.log("ASISTENCIA", asistencia);
        return {fecha, tiempo};
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

module.exports = {
    listarUsuarios,
    validarUsuario,
    registrarEntrada
}
