// eslint-disable-next-line n/no-path-concat
require('app-module-path').addPath(`${__dirname}/`);
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { sequelize } = require('./app/models/index');

require('dotenv').config();

const app = express();

// using rate limiting
const limiter = rateLimit({
  windowMs: 1000, // 1s in milliseconds
  max: 8,
  message: 'You have exceeded the limited request quota!',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.set(path.join(__dirname));
app.use(cors());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = http
  .createServer(app.handle.bind(app))
  .listen(process.env.PORT, () => {
    console.info(`Server up successfully - port: ${process.env.PORT}`);
  });

app.use('/api', require('./app/routes/index'));


process.on('unhandledRejection', (err) => {
  console.error('possibly unhandled rejection happened');
  console.error(err.message);
});


const closeHandler = () => {
  () => sequelize.close();
  httpServer.close(() => {
    console.info('Server is stopped successfully');
    process.exit(0);
  });
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);
