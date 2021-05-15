'use strict';

const faker = require('faker');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:468963793680:pickup';

const store = 'acme-widgets';
const store2 =  '1-206-flowers';

setInterval( async () => {
  const order = {
    id: faker.datatype.uuid(),
    vendorId: 'arn:aws:sqs:us-west-2:468963793680:acme-queue',
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
  console.log(data);
  })
  .catch(console.error);
}, 5000);

setInterval( async () => {
  const order = {
    id: faker.datatype.uuid(),
    vendorId: 'arn:aws:sqs:us-west-2:468963793680:flowers-queue',
    storeName: store2,
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
  console.log(data);
  })
  .catch(console.error);
}, 5000);
