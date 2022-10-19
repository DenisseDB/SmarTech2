const path = require("path");
const Proyecto = require("../models/proyectoModel");
const Tarea  = require("../models/tareaModel");
const Empleado = require("../models/empleadoModel");
const Usuario = require("../models/usuarioModel");
const Reporte = require("../models/reporteModel");
const PDF = require("pdfkit");
const fs = require("fs");

postnuevoReporte = (request, response, next) => {
    Reporte.fetchHoras()
    .then(([rowsReporte, fieldData]) => {
        return response.render(path.join("reporte", "crearReporte"), {
            horas: rowsReporte,
            listaPrivilegios: request.session.privilegios
       });
//    })
    })
    .catch(err => { 
        console.log(err)
    });
}

getReportes = (request, response, next) => {
    // Reporte.fetchHorasReporte(request.session.idSesion, request.params.fechaInicio, request.params.fechaFin)
    Reporte.fetchReporte()
    .then(([rowsRep, fieldData]) => {
        console.log("Datos de filas:", rowsRep)
        return response.render(path.join("reporte", "modificarCrearReporte"), {
            reporte: rowsRep,
            listaPrivilegios: request.session.privilegios
        });
    })
    .catch(err => {
        console.log(err)
    });
}

postReporte = (request, response, next) => {
    const nuevoReporte = new Reporte(request.body.porcentaje, request.body.horasVacaciones, request.body.personalCompletoT, request.body.personalMedioT, request.body.descripcion, request.body.fechaInicio, request.body.fechaFinal);
    nuevoReporte.save()
    .then(() => {
        console.log(nuevoReporte)
    })
    .catch(err => {
        console.log(err)
    });
}

getBuscarReporte = (request, response, next) => {

    Reporte.buscarReporteFecha(request.params.fechaInicio, request.params.fechaFinal)
        .then(([rows, fieldData]) => {
            Reporte.fetchReporte()
            .then(([rowsRep, fieldData]) => {
                 console.log("Los datos del reporte son:", rows);
                 console.log("Rows rep", rowsRep)
            response.status(200).json({fecha: rows, reporte: rowsRep});
            
            })
        })
        .catch(err => { 
            console.log(err);
            response.status(500).json({message: "ERROR 500"});
        });
};

getPDF = async(request, responde, next) => {
        console.log("pdf creado")
        const doc = new PDF();
        doc.pipe(fs.createWriteStream('reporteSemanal.pdf'));
        doc
        // .image("../public/media/logo.png", 50, 45, {width: 50})
        .fillColor("#4444444")
        .fontSize(20)
        .text("Prueba", 110, 57)
        .fontSize(10)
        .text("Texto1", 200, 65, {align: "right"})
        .text("Texto2", 200, 80, {align: "right"})
        .moveDown();
        doc.end();
}

getReporteExistente = (request, response, next) =>{
    Reporte.fetchOne(request.params.noReporte)
    .then(([rowsReporte, fielData]) => {
        Reporte.fetchHoras()
        .then(([rowsHrs, fieldData])=> {
            Reporte.buscarReporteFecha(rowsReporte[0].fechaInicio, rowsReporte[0].fechaFinal)
            .then(([rowsHoras, fieldData]) => {  
                console.log("Las hrs son",rowsHoras)
                response.render(path.join('reporte', 'reportesExistentes.ejs'), {
                reporteN: rowsReporte,
                horas: rowsHoras,
                hrs: rowsHrs,
                listaPrivilegios: request.session.privilegios,   
                })            
            })
        })
    })
    .catch((err) => {
      console.log(err);
    })
  };

//   postEditarReporte = (request, response, next) => {
//     Reporte.fetchOne(request.params.noReporte)
//         .then(([rowsRep, fielData]) => {
//             (rowsRep[0].nombreT = request.body.nombreT),
//                 (rowsTarea[0].horasTrabajo = request.body.horasRegistradas),
//                 //console.log(rowsTarea);
//                 Tarea.editarTablaTarea(
//                     rowsTarea[0].nombreT,
//                     rowsTarea[0].horasTrabajo,
//                     rowsTarea[0].idTarea
//                 )
//                     .then(([rowsTarea, fielData]) => {
//                         response.status(200).json({ mensaje: 'Tarea editada correctamente', idProyecto: rowsTarea[0].idProyecto });
//                     })
//                     .catch((err) => console.log(err));
//         })
//         .catch((err) => console.log(err));
// };

module.exports = {
    postnuevoReporte,
    getReportes,
    postReporte,
    getBuscarReporte,
    getPDF,
    getReporteExistente
}
