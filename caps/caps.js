'use strict';

require('dotenv').config();
const host = process.env.PORT || 'http://localhost:3000';
const io = require('socket.io-client');
let socket = io.connect(`${host}/caps`);

const store = 'acme-widgets';
const store2 =  '1-206-flowers';

socket.emit('getAll', store);
socket.emit('getAll', store2);

socket.on('pickup', payload => {
  console.log(('Event:', {
    event: 'pickup',
    time: new Date,
    payload
  }), '\n');

});

socket.on('inTransit', payload => {
  console.log(('Event:', {
    event: 'in-transit',
    time: new Date,
    payload
  }), '\n');
});

socket.on('delivered', payload => {
  console.log(('Event:', {
    event: 'delivered',
    time: new Date,
    payload
  }), '\n');
  socket.emit('received', payload);
});

socket.on('message', payload => {
  console.log(payload);
  socket.emit('received', payload);
})
