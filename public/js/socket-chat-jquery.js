var params = new URLSearchParams(window.location.search);
var username = params.get('user');
var lobby = params.get('lobby');
// Object references
var userPanel = $('#divUsuarios');
var formSend = $('#formSend');
var messageTxt = $('#messageTxt');
var divChatbox = $('#divChatbox');

// Show users in lobby
function showUsersPanel(persons) { // personas: [{},{}...]
    console.log(persons);
    var html = '';
    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${lobby}</span></a>
            </li>`;

    persons.forEach(person => {
        html += `<li>
                    <a data-id="${person.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${person.name} <small class="text-success">online</small></span></a>
                </li>`;
    });

    userPanel.html(html);
}
// Show messages
function showMessages(msg, myself) {
    var html = '';
    var date = new Date(msg.date);
    var hour = `${date.getHours()}:${date.getMinutes()}`;
    var chatBoxClass = 'info';
    var chatImage = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';

    if (msg.user === 'Admin') {
        chatBoxClass = 'danger';
        chatImage = ''
    }

    if (myself) {
        html = `<li class="reverse">
                    <div class="chat-content">
                        <h5>${msg.user}</h5>
                        <div class="box bg-light-inverse">${msg.msg}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                    <div class="chat-time">${hour}</div>
                </li>`;
    } else {
        html = `<li class="animated fadeIn">
                    ${chatImage}
                    <div class="chat-content">
                        <h5>${msg.user}</h5>
                        <div class="box bg-light-${chatBoxClass}">${msg.msg}</div>
                    </div>
                    <div class="chat-time">${hour}</div>
                </li>`;
    }

    divChatbox.append(html);


}

// Listeners

// Get user ID
userPanel.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

// Send message
formSend.on('submit', function(e) {
    e.preventDefault();
    if (messageTxt.val().trim().length > 0) {
        console.log(messageTxt.val());
        // Enviar información
        socket.emit('createMessage', {
            usuario: username,
            msg: messageTxt.val()
        }, function(resp) {
            console.log('respuesta server: ', resp);
            messageTxt.val('').focus();
            showMessages(resp, true);
        });
        scrollBottom();
    }
});

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