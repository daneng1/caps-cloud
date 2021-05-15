'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const faker = require('faker');

//subscribes to packages sqs and publishes data to vendor sqs that package was delivered
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/468963793680/packages',
  handleMessage: async (message) => {
      const msg = JSON.parse(message.Body);
      const order = JSON.parse(msg.Message)
      console.log("Order Picked Up: ", order);

      setTimeout(async () => {
          const producer = Producer.create({
              queueUrl: order.vendorId,
              region: 'us-west-2'
          });

          await producer.send({
              id: faker.datatype.uuid(),
              body: JSON.stringify(order)
          });
          console.log('--------', '\n', (`Delivered Order #${order.id} to ${order.name}`), '\n', '--------')
          // console.log('Sending Delivery Confirmation to Vendor')
      }, 3000)

  },
  pollingWaitTimeMs: 5000

});


app.start();
