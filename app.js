// Creamos un Servidor WEB con "EXPRESS" dentro de "JS", esto va a ser el motor de la Aplicación WEB, se va a encargar de recibir peticiones HTTP,
// de crear controladores, de tener disponibles rutas, Etc... todo esto para poder construir el servidio RESTFULL de la mejor manera posible a nivel
// de BackEnd.


// Significa que puede usar las nuevas instrucciones de los nuevos estandares de JavaScript
'use strict'


// ++++ REQUIRES = Es una importación de librerías ya sea de terceros o personalizadas que ocupamos para que funcione algo ++++
// Recordar que todo lo que teclamos es KEY SENSITIVE, es decir, se diferencian minúsculas de mayúsculas
// Cargamos el módulo "express", nos va a permitir trabajar con las rutas, protocolo HTTP, etc.
var express =  require('express');

// Variable para cargar el módulo de Mongoose, nos va a servir para conectarnos a MongoDB para trabajar con la BDD dentro de nuestra API REST
var mongoose = require('mongoose');

// Cargamos la dependencia "colors" para poder manejar color de texto en la consola
var colors = require('colors');

// Cargamos el módulo "body-parser" que sirve para convertir los JSON (de las peticiones API)
// que nos llegan a un objeto JavaScript usables y funcionales
var bodyParser = require('body-parser');



// ++++ INICIALIZACIÓN DE VARIBLES ++++
// Invocamos a la función "express", carga el framework de "express" directamente, estamos definiendo el Servidor EXPRESS
var app = express();


// ++++ CARGAR RUTAS ++++
// Cargamos el módulo de configuración de rutas que creamos en la carpeta de "rutas" en el archivo "app.js"
// Esta es la ruta principal
var rutaPrincipal = require('./Rutas/app');
//Cargamos el módulo de configuración de rutas que creamos en la carpeta de "Rutas" en el archivo "usuario.js"
var usuario_Rutas = require('./Rutas/usuario');
//Cargamos el módulo de configuración de login que creamos en la carpeta de "Rutas" en el archivo "login.js"
var login_Rutas = require('./Rutas/login');



//-- MIDDLEWARE DE BODY-PARSER 
// ¡¡¡ NOTA.- Este apartado del BODY-PARSER debe ir antes del apartado de "RUTAS BASE" de lo contrario no funcionará !!!
// Son funciones, métodos que se ejecutan en primer lugar cuando se ejecutan peticiones HTTP, antes de que llegue a un controlador) --
// Si hay algo en el BODY que nosotros estémos enviando el BODY-PARSER lo va a tomar y nos va a crear el objeto de JavaScript para que
// lo podamos utilizar en cualquier lugar
app.use(bodyParser.urlencoded({extended:false}))    //Creamos el middleware
app.use(bodyParser.json());                         //Lo que traiga el body lo convertimos a JSON para poder usarlo dentro de nuestro código



// -- RUTAS BASE
// Aquí cargamos la configuración de rutas) --
/*  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// "app.use"         = Nos permite hacer middleware, es decir, en cada petción que se haga el middleware siempre se va a ejecutar antes de llegar a la acción del controlador
//                   El middleware es algo que se ejecuta antes de que se resuelvan otras rutas

// "Usuario_Rutas" =  Ruta para los "Usuarios"
app.use('/usuario',usuario_Rutas);
// "Usuario_Rutas" =  Ruta para el "Login"
app.use('/login',login_Rutas);

// Esta debe de ir al final, si la ponemos antes de otras rutas entonces siempre se estará llamando a esta ruta y no entrarán las que estén debajo de ella
// "/"              = Es la ruta principal
// "rutaPrincipal"  = Ruta Principal, se activa cuando cualquier petición haga match con la pleca (/)
app.use('/',rutaPrincipal);
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */




// Escuchar peticiones a travez del puerto 3000 y a parte ponemos un mensaje para saber si el Servidor
// se logró levantr o sucedió un error
app.listen(3000, ()=>{    
    console.log('Express Server Puerto 3000:', 'online'.green);
});



// ++++ CONEXIÓN A LA BDD ++++
// usamos función de callback tipo flecha
// "localhost:27017"        = Es el puerto por default de MongoDB, eso lo configuramos en Robo 3T, y su valor lo vemos al ejecutar el MONGOD
// "hospitalDB"             = Es nuestra Base de Datos, la creamos en Robo 3T, si la BDD o existe entonces se crea
// "{useNewUrlParser:true}" = Es una nueva versión del analizador de cadenas, aún no es obligatorio pero ya lo podemos usar y nos evitamos un mensaje de advertencia
//                            que aparece en la ventana del CMD cuando hace la conexión a la BDD
// "( err, res )"           = Función de callback que recibe 2 parámetros, un error(err) o una respuesta(res)
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{useNewUrlParser:true}, ( err, res )=>{
    // Sucedió un error, aquí se detiene todo el proceso
    if(err) throw err;

    // Todo OK, Node logró la conexión con la BDD de MONGO
    console.log('Base de Datos:', 'online'.magenta);
});

