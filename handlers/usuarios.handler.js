const {listarUsuarios, validarUsuario, registrarEntrada} = require('../controllers/usuarios.controller.js');

const listarUsuariosHandler = async (req, res) => {
    try {
        const response = await listarUsuarios();
        res.status(200).json({status:'ok', data:response});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
}

const validarLoginUsuarioHandler = async (req, res) => {
    try {
        console.log(req.body);
        const {usuario, clave} = req.body;
        const response = await validarUsuario(usuario, clave);
        console.log('response',response);
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error en consulta"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
}

const registrarEntradaHandler = async (req,res) => {
    try {
        const {usuario} = req.body;
        const response = await registrarEntrada(usuario);
        console.log('response',response);
        if(response) res.status(200).json({status:'ok', data:response});
        else res.status(400).json({status:'fail',error: "Error en consulta"});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
}

module.exports = {
    listarUsuariosHandler,
    validarLoginUsuarioHandler,
    registrarEntradaHandler
}
