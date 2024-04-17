const { Router } = require("express");
const {listarUsuariosHandler, validarLoginUsuarioHandler,registrarEntradaHandler} = require('../handlers/usuarios.handler.js');

const router = Router();

router.get('/', listarUsuariosHandler);
router.post('/login', validarLoginUsuarioHandler);
router.post('/entrada', registrarEntradaHandler);

module.exports = router;

