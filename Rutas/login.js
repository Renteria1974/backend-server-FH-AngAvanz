// FICHERO DE CONFIGURACIÓN DE RUTAS DE "USUARIOS"

// Significa que puede usar las nuevas instrucciones de los nuevos estandares de JavaScript
'use strict'

// ++++ REQUIRES = Es una importación de librerías ya sea de terceros o personalizadas que ocupamos para que funcione algo ++++
// Recordar que todo lo que teclamos es KEY SENSITIVE, es decir, se diferencian minúsculas de mayúsculas
// Cargamos el módulo "express", nos va a permitir trabajar con las rutas, protocolo HTTP, etc.
var express =  require('express');

// Cargamos el módulo "bcrypt", esto nos permite hacer un cifrado de passwords
var bcrypt = require('bcrypt');

// SERVICIO JWT
// Importar el módulo de JWT, las librerías JWT, para poder acceder a sus métodos
// Nos permite generar un token que será devuelto (en lugar de regresar los datos) cuando se ha logueado correctamente a un usuario
// JSON = Formato de texto Ligero de intercambio de datos basado en un subconjunto del Lenguaje de Programación JavaScript, es independiente del lenguaje que se utiliza
//      puede representar 4 tipos primitivos (cadenas, números, booleanos, valores nulos) y 2 estructurados (objetos y arreglos)
// JWT (JSON WEB TOKEN) = Conjunto de medios de seguridad para peticiones http para representar demandas para ser transferidos entre el cliente y el servidor. Es un
//       Contenedor de Información referente a la autenticación de un usuario. Las partes de un JWT se codifican como un objeto que está firmado digitalmente
//       utilizando JWS (JSON Web Signature)
var jwt = require('jsonwebtoken');




// ++++ INICIALIZACIÓN DE VARIBLES ++++
// Invocamos a la función "express", carga el framework de "express" directamente, estamos definiendo el Servidor EXPRESS
var app = express();

// Importamos el Esquema de Usuario que definimos en "Modelos/Usuario.js" para poder usar todas las fuciones y métodos que tiene dicho Modelo
var Usuario = require('../Modelos/usuario');

// Importamos el archivo "config.js" para poder usar la constante SEED
// ".SEED" = Aquí mismo le damos el valor de la constante a la variable que estamos declarando
var SEED = require('../config/config').SEED;



// ===========================================
// ++++ COMPROBAMOS QUE EL USUARIO EXISTE  ++++
// ===========================================
// "app."   = Hacemos la referencia al EXPRESS
// "post"   = Tipo de petición que vamos a estar escuchando, en este caso es un POST
// "'/'"    = Es el PATH, en este caso es la raíz
// "(pet, res, next ) =>" = Es una funcion de callback que recibe 3 parámetros: petición(pet), respuesta(res) y next(le dice a EXPRESS que cuando
//            se ejecute esta función cotinue con la sig. instrucción, aunque por lo regular este parámetro se usa en los MIDDLEWARE)
// Aquí recibimos la información que se envía mediante un HTTP POST o un POST
app.post('/',  ( pet, res, next ) =>
{  
    //Si nos llegan datos por POST o GET utilizamos "body"
    //Si nos llegan los datos por la URL utilizamos "params"

    // Recoger los parámetros que nos llegan por la petición (por el body), que nos llegan por POST
    var params  = pet.body;

    //Variable que guarda el valor de "email" del objeto "params"
    var email = params.email;

    //Variable que guarda el valor de "password" del objeto "params"
    var password = params.password;


    //Verificamos que el email del usuario nuevo SI exista en la BDD 
    //Buscamos en la colección de Usuarios(Usuario) un solo documento(findOne) cuyo email(email) sea igual al email que llega por post(email)
    //se tiene una función de callback que recibe como parámetro un error(err) o un usuario que existe(usuario)
    Usuario.findOne({email: email},(err,usuario) =>
    {
        //En caso de ocurrir un error salimos del proceso con "return" y enviamos el mensaje
        if(err)
        {
            return res.status(500).json({
            ok: false,   
            mensaje: 'Error al comprobar la existencia del Usuario',
            errores: err 
            });    
        }

        //No se localiza al Usuario con el id Especificado
        if(!usuario)
        {
            return res.status(400).json({
            ok: false,   
            mensaje: 'Credenciales incorrectas - email',
            errores:err
            });    
        }

        // El email es válido, ahora hay que verificar que le password también sea correcto
        // Se pasa el password que se está recibiendo por POST(password) y el password que está en BDD(usuario.password) y se comparan        
        // y retorna TRUE en caso de ser positiva la comparativa y FALSE en caso contrario
        if(!bcrypt.compareSync(password,usuario.password))
        {
            // El password NO es válido
            return res.status(400).json({
                ok: false,   
                mensaje: 'Credenciales incorrectas - password',
                errores:err
            });
        }

        //Por cuestiones de seguridad NO devolvemos el Password
        usuario.password = undefined;

        // Crear el Token
        // ".sign" = Es como firmar
        // "{usuario:usuario}"                  = PAYLOAD, Es el primer parámetro, es la data que se quiere colocar en el token
        // "'@es mi semilla de autenticacion'"  = SEED,El segundo parámetro es lo que nos ayuda a crear un token único a pesar de que usamos una librería que no hicimos nosotros, se le conoce como SEED o semilla
        // "{ expiresIn: 14400}"                = Fecha de expiración del Token, en este caso son 4 horas
        var token = jwt.sign({ usuario:usuario}, SEED ,{ expiresIn: 14400});
        
        res.status(200).json({
            ok: true,                                    
            usuario: usuario,
            token: token,
            id: usuario._id
        });                
            
    });



    
    
});



// Exportamos el módulo
// Esto es para que podamos usar el "app" fuera de este archivo (las rutas)
module.exports = app;