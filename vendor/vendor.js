'use strict';

const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const { Consumer } = require('sqs-consumer');

const sns = new AWS.SNS();

// sets topic to arn of sns
const topic = 'arn:aws:sns:us-west-2:468963793680:pickup';

const store = 'acme-widgets';
const vendor = 'https://sqs.us-west-2.amazonaws.com/468963793680/acme-queue';

//creates new order and sends payload to sns
setInterval( async () => {
  const order = {
    id: faker.datatype.uuid(),
    vendorId: vendor,
    storeName: store,
    name: faker.name.findName(),
    address: faker.address.streetAddress()
  };
  let payload = {
    Message: JSON.stringify(order),
    TopicArn: topic
    }
  console.log(payload);

  sns.publish(payload).promise()
    .then(data => {
    console.log('Pickup Requested');
    })
    .catch(console.error);
}, 5000);

//subsribes to vendor sqs and logs that it was delivered
const app = Consumer.create({
  queueUrl: vendor,
  handleMessage: async (message) => {
  console.log('Delivered:', message.Body)
  },
  pollingWaitTimeMs: 3000
});

app.start();
