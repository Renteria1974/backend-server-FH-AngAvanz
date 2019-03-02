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

// Cargamos la dependencia "colors" parap oder manejar color de texto en la consola
var colors = require('colors');



// ++++ INICIALIZACIÓN DE VARIBLES ++++
// Invocamos a la función "express", carga el framework de "express" directamente, estamos definiendo el Servidor EXPRESS
var app = express();


// ++++ CARGAR RUTAS ++++
// "app."   = Hacemos la referencia al EXPRESS
// "get"    = Tipo de petición que vamos a estar escuchando, en este caso es un GET
// "'/'"    = Es el PATH, en este caso es la raíz
// "(req, res, next ) =>" = Es una funcion de callback que recibe 3 parámetros: error(req), respuesta(res) y next(le dice a EXPRESS que cuando
//            se ejecute esta función cotinue con la sig. instrucción, aunque por lo regular este parámetro se usa en los MIDDLEWARE)
app.get('/', (req, res, next ) => {
    // Indicamos que la operación se realizó correctamente
    // ".json" = Covertimos la respuesta a un objeto JSON
    res.status(200).json({
        ok: true,   // La petición se realizó correctamente
        mensaje: 'Petición realizada Correstamente'  // Mensaje que queremos mostrar
    });
});



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
})   

