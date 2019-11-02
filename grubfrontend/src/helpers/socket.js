import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3003');



function message (payload) {
    socket.on("reply",(reply) => console.log("recieved reply ",reply));
    socket.emit('message',payload);
}

export {message}