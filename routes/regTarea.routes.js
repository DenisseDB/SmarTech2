const express = require("express");
const router = express.Router();

const regTareaController = require("../controllers/regTarea.controller");

router.get("/registrarTarea", regTareaController.getnuevaTarea);
router.post("/registrarTarea", regTareaController.postnuevaTarea);
router.get("/misTareas", regTareaController.getTareas);
router.get('/buscar/:fechaInicio/:fechaFin', regTareaController.getBuscar);
router.get('/horasTarea/:idProyecto', regTareaController.getHorasXtarea)

router.get('/editar/:idTarea', regTareaController.getEditarTarea);
router.post('/editar',  regTareaController.postEditarTarea);
router.post('/eliminar/:id', regTareaController.borrarColaborador);

//router.post('/borrar/:idTarea', regTareaController.postBorrarTarea);

module.exports = router;