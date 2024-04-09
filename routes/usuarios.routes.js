const { Router } = require("express");
const {listarUsuariosHandler} = require('../handlers/usuarios.handler.js');

const router = Router();

router.get('/', listarUsuariosHandler);

module.exports = router;

