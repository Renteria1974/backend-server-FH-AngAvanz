// ++++ MODELO DE "USUARIO" ++++
// Es una representación de una Entidad de la BDD

// Significa que puede usar las nuevas instrucciones de los nuevos estandares de JavaScript
'use strict'

// Variable para cargar el módulo de Mongoose, nos va a servir para trabajar con la BDD dentro de nuestra API REST
var mongoose = require('mongoose');

// Variable para cargar el módulo de Mongoose-unique-validator, nos va a servir para validar los campos que tienen la propiedad "unique=true"
var uniqueValidator = require('mongoose-unique-validator');

//Cargamos los esquemas de mongoose
var Esquema = mongoose.Schema;

// Declaración del objeto que contiene los valores válidos que va ap ermitir el campo "role"usuario.js
// los campos "values" y "message" deben tener ese nombre, cualquier otro valor genera error o respuesta incorrecta
var rolesValidos =
{
    values:     ['ADMIN_ROLE','USER_ROLE'],
    message:    '{VALUE} No es un Rol permitido'
};


// Definimos el esquema de nuestra colección de Usuarios, es la estructura que va a tener el objeto
// "Esquema" = Función que recibe un objeto de JavaScript con la configuración del esquema que vamso a definir
var EsquemaUsuario = new Esquema({
    // "required:[true,"            = Indicamos que es un campo requerido, obligatorio
    // "'El nombre es Necesario'"   = Comentario que se mostrará cuando la condición de "required=true" no se cumpla, es decir, que en dicho campo no se tecleó nada
    // "uppercase: true"            = Convierte a mayusculas elvalor tecleado en el campo
    // "unique:true"                = Indicamos que el valor del campo es único, no se puede repetir
    // "default: 'USER_ROLE'"       = Valor por default del campo
    nombre:             {type: String, required: [true, 'El nombre es Necesario'] },
    apellido:           {type: String, required: [true, 'El Apellido es Necesario'] },
    email:              {type: String, unique: true, required: [true, 'El Correo es Necesario'] },
    password:           {type: String, required: [true, 'La Contraseña es Necesaria'] },
    img:                {type: String, required: false},
    role:               {type: String, required: true, uppercase: true, default: 'USER_ROLE', enum: rolesValidos }
},
{
    versionKey:false    // Es para quitar el "VersionKey"  (campo que aparece en los registros y que se llama "_v"), realmente no es necesario
});


// Aquí le indicamos a MONGOOSE que en este esquema va a estar actuando el UNIQUE-VALIDATOR en los campos con lap ropiedad "unique=true"
// "{ message: '{PATH} El correo debe ser único' }" = Mensaje que aparecerá cuando se intente violar la restricción de campo con valor único
// "{PATH}" = Es el nombre del campo, esto previene que se tenga más de un campo con la restricción
EsquemaUsuario.plugin(uniqueValidator, { message: '{PATH} El correo debe ser único' });


//-- Exportamos el Módulo --
//"mongoose.model":     Se genera el modelo
//"'Usuario'":          Nombre de la entidad, va a representar a un documento de la entidad de "Usuarios"
//                      Cuando el objeto se guarde en BDD lo que va a pasar es que al nombre de la entidad ("Usuario") lo pondrá en minusculas y lo pluralizará, es decir, va a generar
//                      la colección "usuarios" y guardará un documento con el esquema definido aquí
//"EsquemaUsuario":     Esquema que va a tener cada objeto que se crea con este modelo
module.exports = mongoose.model('Usuario',EsquemaUsuario);
