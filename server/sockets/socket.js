const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../util/util')

const users = new Users();

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('chatLogin', (data, callback) => {
        if (!data.name || !data.lobby) {
            return callback({
                err: true,
                msg: 'username and lobby are required'
            });
        }
        // Enter lobby
        client.join(data.lobby);

        let persons = users.addPerson(client.id, data.name, data.lobby);
        console.log(data);

        client.broadcast.to(data.lobby).emit('createMessage', createMessage('Admin', `${data.name} logged in`));
        client.broadcast.to(data.lobby).emit('personList', users.getPersonsByLoby(data.lobby));

        callback(users.getPersonsByLoby(data.lobby));
    });

    client.on('disconnect', () => {
        let removedUser = users.removePerson(client.id);

        client.broadcast.to(removedUser.lobby).emit('createMessage', createMessage('Admin', `${removedUser.name} logged out`));
        client.broadcast.to(removedUser.lobby).emit('personList', users.getPersonsByLoby(removedUser.lobby));
    });

    client.on('createMessage', (data, callback) => {
        let user = users.getPersonById(client.id);
        const msg = createMessage(user.name, data.msg)
        client.broadcast.to(user.lobby).emit('createMessage', msg);

        callback(msg);
    });

    // Private Message
    client.on('privateMsg', (data) => {
        let emitterUser = users.getPersonById(client.id);
        client.broadcast.to(data.destination).emit('privateMsg', createMessage(emitterUser.name, data.msg));
    });
});