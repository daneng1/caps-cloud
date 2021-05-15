'use strict';
const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

let sqs = new AWS.SQS();

const flowers = Producer.create({
  queueUrl: `https://sqs.us-west-2.amazonaws.com/468963793680/flowers-queue`,
  region: `us-west-2`,
});

const acme = Producer.create({
  queueUrl: `https://sqs.us-west-2.amazonaws.com/468963793680/acme-queue`,
  region: `us-west-2`,
});

const store = '';
const bodyId = '';
const receiptHandle = '';

const flowersArn = 'arn:aws:sqs:us-west-2:468963793680:flowers-queue';
const acmeArn = 'arn:aws:sqs:us-west-2:468963793680:acme-queue';

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/468963793680/packages',
  handleMessage: async (message) => {
    const messageBody = message.Body;
    console.log(message.ReceiptHandle);
    const receipt = message.ReceiptHandle;
    receiptHandle.push(receipt);
    const body = JSON.parse(messageBody);
    const storeId = JSON.parse(body.Message).vendorId;
    // console.log(storeId);
    const id = JSON.parse(body.Message).id;
    bodyId.push(id);
    store.push(storeId);

  }
});
app.start();

setInterval(async () => {

  try {
    const message = {
      id: faker.datatype.uuid(),
      body: `Package ${bodyId} is DELIVERED`,
    };
    // console.log(store, flowersArn, acmeArn);
    if (store === flowersArn) await flowers.send(message);
    if (store === acmeArn) await acme.send(message);
    // console.log(response);
  } catch (e) {
    console.error(e);
  }

  var params = {
    QueueUrl: 'https://sqs.us-west-2.amazonaws.com/468963793680/packages', /* required */
    ReceiptHandle: receiptHandle /* required */
  };
  sqs.deleteMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);  // successful response
  });
  
}, 1000);
