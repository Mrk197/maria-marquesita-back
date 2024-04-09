const {listarUsuarios} = require('../controllers/usuarios.controller.js');

const listarUsuariosHandler = async (req, res) => {
    try {
        const response = await listarUsuarios();
        res.status(200).json({status:'ok', data:response});
    } catch (error) {
        res.status(400).json({status:'fail',error: error.message});
    }
}

module.exports = {
    listarUsuariosHandler
}