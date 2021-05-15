'use strict';

require('dotenv').config();
const host = process.env.PORT || 3000;
const io = require('socket.io')(host);
const uuid = require('uuid').v4;

const server = io.of('/caps');

const queue = {
  'acme-widgets': {},
  '1-206-flowers': {}
}

server.on('connection', socket => {
  console.log('connected', socket.id);

  socket.on('pickup', payload => {
    let store = payload.storeName;
    let id = uuid();
    queue[store][id] = payload;
    console.log('current queue:', queue);
    server.emit('pickup', {id, payload});
  })
  
  socket.on('inTransit', payload => {
    server.emit('inTransit', payload);
  })

  socket.on('delivered', payload => {
    
    server.emit('delivered', payload);
  })

  socket.on('getAll', payload => {
    Object.keys(queue[payload]).forEach((id) => {
      server.emit('message', { payload: queue[payload][id]});
    })
  })

  socket.on('received', payload => {
    let store = payload.payload.storeName;
    let orderID = payload.id;
    console.log('current queue', queue[store][orderID]);
    delete queue[store][orderID];
  })


})


// '3fd65bf6-75b0-4468-8576-cdd28fd855b9': {
//   storeName: '1-206-flowers',
//   orderId: '1514a877-3d86-46a4-8dbd-13b1497697be',
//   name: 'Clara Daniel',
//   address: '941 Simonis Station'