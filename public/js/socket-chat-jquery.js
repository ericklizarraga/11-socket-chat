

var params = new URLSearchParams(window.location.search);
var divUsuarios = $('#divUsuarios');
var formenviar = $('#formenviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

var nombre = params.get('nombre');
var sala = params.get('sala');

//funciones para renderizra usuarios
function renderizarUsuarios(personas = []) {

    var html = '';

    html = `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
        </li>
    `;

    personas.forEach(persona => {
        html += `
            <li>
                <a data-id=${persona.id} href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${persona.nombre} <small class="text-success">online</small></span></a>
            </li>        
        `;
    });

    divUsuarios.html(html);
}



//_-------------------------------------------

function renderizarMensajes( { nombre, mensaje, fecha } , yo ){

    var html = '';
    const fecha2 = new Date( fecha );
    var hora = fecha2.getHours()+ ' : '+ fecha2.getMinutes();


    var adminclass = 'info';
    if( nombre === 'Administrador')
            adminclass='danger';
    if( yo ){
       
        html +=`
        <li class="reverse">
            <div class="chat-content">
                <h5>${nombre}</h5>
                <div class="box bg-light-inverse">${mensaje}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
            <div class="chat-time">${ hora }</div>
        </li> 
    `; 
    }else{
            html += `
            <li class="animated fadeIn">
                ${
                    ( nombre != 'Administrador' ) ? `<div class="chat-img">
                    <img src="assets/images/users/1.jpg" alt="user" />
                    </div>` :''
                }
                
                <div class="chat-content">
                        <h5>${nombre}</h5>
                    <div class="box bg-light-${adminclass}">
                         ${mensaje}
                    </div>
                </div>

                <div class="chat-time">
                    ${hora}
                </div>
            </li>
        `;
    }

    divChatbox.append( html );
}

//------------------------------

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//listeners----------------------

divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');
    if (id)
        console.log(id);
});

formenviar.on('submit', (e) => {
    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) return;

    // Enviar información
    socket.emit('crearMensaje', {
        nombre,
        mensaje:  txtMensaje.val()
    }, function(resp) {
        // console.log('respuesta server: ', resp);
        txtMensaje.val('').focus();
        renderizarMensajes( resp, true );
        scrollBottom();
    });
});