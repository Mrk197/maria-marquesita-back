const { Router } = require("express");
const {
    listarUsuariosHandler, 
    validarLoginUsuarioHandler, 
    registrarAsistenciaHandler, 
    obtenerAsignacionHandler} 
= require('../handlers/usuarios.handler.js');

const router = Router();

router.get('/', listarUsuariosHandler);
router.post('/login', validarLoginUsuarioHandler);
router.post('/asistencia', registrarAsistenciaHandler);
router.get('/asignacion', obtenerAsignacionHandler);


module.exports = router;

