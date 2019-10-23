const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('./../kafkaconfig');
var createUserProducer = (data) => {
try {
    const Producer = kafka.Producer;
    const client = new kafka.KafkaClient(config.kafka_server);
    const producer = new Producer(client);
    const kafka_topic = config.kafka_topic;
    console.log(kafka_topic);
    let payloads = [
      {
        topic: kafka_topic,
        messages: JSON.stringify(data)
      }
    ];
  
    producer.on('ready', async function() {
      let push_status = producer.send(payloads, (err, data) => {
        if (err) {
          console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
        } else {
          console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
        }
      });
    });
  
    producer.on('error', function(err) {
      console.log(err);
      console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
      throw err;
    });
  }
  catch(e) {
    console.log(e);
  }
}

var recieveMessage = () => {
    try {
        const Consumer = kafka.HighLevelConsumer;
        const client = new kafka.Client(config.kafka_server);
        let consumer = new Consumer(
          client,
          [{ topic: config.kafka_topic, partition: 0 }],
          {
            autoCommit: true,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024,
            encoding: 'utf8',
            fromOffset: false
          }
        );
        consumer.on('message', async function(message) {
          console.log('here');
          console.log(
            'kafka-> ',
            message.value
          );
        })
        consumer.on('error', function(err) {
          console.log('error', err);
        });
      }
      catch(e) {
        console.log(e);
      }
}

module.exports.createUserProducer = createUserProducer;
module.exports.recieveMessage = recieveMessage;