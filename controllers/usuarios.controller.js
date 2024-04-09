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

module.exports = {
    listarUsuarios
}