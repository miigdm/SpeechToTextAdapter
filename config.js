const env = require('dotenv');

env.config();

module.exports.variables = {
  subscriptionKey: process.env.STT_APIKEY || 'dd0d69b4cda04207a7aa60b3b49778b3',
  serviceRegion: process.env.STT_REGION || 'eastus',
  language: process.env.STT_LANGUAGE || 'es-CL',
  port: process.env.STT_PORT || '4000',
  LogLevel: process.env.LOG_LEVEL || 'debug',
};
