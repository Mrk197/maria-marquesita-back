const { Router } = require("express");
const {listarUsuariosHandler, validarLoginUsuarioHandler, registrarAsistenciaHandler} = require('../handlers/usuarios.handler.js');

const router = Router();

router.get('/', listarUsuariosHandler);
router.post('/login', validarLoginUsuarioHandler);
router.post('/asistencia', registrarAsistenciaHandler);

module.exports = router;

