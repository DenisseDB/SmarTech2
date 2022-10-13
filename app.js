// librerias base
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const csrf = require("csurf");
const morgan = require("morgan");
require('dotenv').config();

// uso de librerias
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// estatico, de eso no se mueve
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));


// cookies
app.use(
  session({
    secret: "jdfefwedewdwefsdsfsfsefewwfcvbjkygfvjm",
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió
    cookie: {maxAge : 300000},
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
  })
  );
  
  
  /* evitar mal uso de ruteo
const csrfProtection = csrf();
app.use(csrfProtection);

app.use((request, response, next) => {
  response.locals.csrfToken = request.csrfToken();
  next();
});*/

// rutas a utilizar
const rutaUsuario = require("./routes/user.routes");
const rutasRegTarea = require("./routes/tarea.routes");
const rutasRegProyecto = require("./routes/proyecto.routes");
const rutasReporte = require("./routes/reporte.routes");

app.use("/tarea", rutasRegTarea);
app.use("/user", rutaUsuario);
app.use("/proyecto", rutasRegProyecto);
app.use("/reporte",  rutasReporte);

app.get('/', (request, response, next) => {
  response.redirect("/user/login"); //Manda la respuesta
})


// ERROR 404
app.use((request, response, next) => {
  response.status(404);
  response.send("Error 404: El recurso solicitado no existe"); //Manda la respuesta
});

app.listen(process.env.PORT);
console.log(`App is listening on ${process.env.PORT}`)
