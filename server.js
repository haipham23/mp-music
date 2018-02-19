require('dotenv').config();

const GenericService = require('chat-ms');

const routes = require('./routes');

new GenericService({
  routes,
  port: process.env.PORT
}).init();