const { Usuario } = require('../classes/usuario');
const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utillidades');

const usuarios = new Usuario();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        console.log(data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'el nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //-----------------------------------------------------------------

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //-------------------------------------------------------------------

    client.on('crearMensaje', (data, callback ) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback( mensaje );
    });

    //mesajes privados
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);//la persona qiue lo envia
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    });
});