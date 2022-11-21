var socket = io();

var params = new URLSearchParams(location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('el nombre es necesario y la sala tambien');
}

var usuario = { 
    nombre: params.get('nombre'), 
    sala: params.get('sala'), 
};

socket.on('connect', function () {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, (resp) => {
        console.log('usuarios conectado2 ', resp);
    })
});


// escuchar
socket.on('disconnect', function () {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function (resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function (mensaje) {

    console.log('Servidor:', mensaje);

});

//escuchar cambios de usuarios
//cunado un user entra o sale del chat
socket.on('listaPersona', function (mensaje) {

    console.log('usuarios-mas:', mensaje);

});


//mensajes privados
socket.on('mensajePrivado', ( mensaje ) => {
    console.log('mensaje privado ', mensaje);
})
socket.emit('mensajePrivado',{ mensaje: 'hola mundo',para:'EYaYHgTBeFNUPq2yAAAE'} );