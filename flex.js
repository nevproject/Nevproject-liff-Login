'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "XOZU1WwHmqFO5eftBvmyoVt6kHKRoSSSLd/6IBmPaCQya5MFN0xG1+Fjn3GRJ+/JN7FLZwiG46t7MwBv1CAcjBG2RkcvBhljbf7E7ACQvoV54LLxFzH0XVzv7myt69OHjQOyHG/EEuXicPnyklR4vQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "12f232e54f4671f360592250e09fd6d2",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
