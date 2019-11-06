var io = require('socket.io-client')
var socket = io()
function message(payload) {
    socket.emit('peer-msg', payload);
}
function init() {
    return socket;
}

export { message, init };