var socket = io();
var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('lobby')) {
    window.location = 'index.html';
    throw new Error('User Name and Lobby are required');
}

var user = {
    name: params.get('name'),
    lobby: params.get('lobby')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('chatLogin', user, function(resp) {
        console.log('logged users', resp);
        showUsersPanel(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('createMessage', {
//     user: 'Fernando',
//     msg: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Servidor:', mensaje);
    showMessages(mensaje, false);
    scrollBottom();

});
// On User login/logout
socket.on('personList', function(persons) {

    console.log(persons);
    showUsersPanel(persons);

});

// Private message
socket.on('privateMsg', function(msg) {
    console.log('Private Message:', msg);
});