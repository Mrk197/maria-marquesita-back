const express = require('express');
const cors = require('cors');
const router = require('./routes/usuarios.routes.js');
const routerVentas = require('./routes/ventas.routes.js');

const server=express();

const PORT=5000;

server.use(cors());
server.use(express.json());
server.use("/usuarios", router);
server.use("/ventas", routerVentas);
server.get("/", (req, res) => {
    res.status(200).send({status: 'ok', data:'Respuesta desde el servidor'});
});

server.listen(PORT,()=>{console.log('Servidor corriendo en el puerto',PORT);});

