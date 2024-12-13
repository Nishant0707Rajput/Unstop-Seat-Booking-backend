// require('dotenv').config();

const { env } = require('../constant/environment');

module.exports = {
  'development': {
    'username': env.DB_USER,
    'password': env.DB_PASSWORD,
    'database': env.DB_NAME,
    'host': env.DB_HOST,
    'port':env.DB_PORT,
    'dialect': 'mysql',
    'max': 20, // maximum connection which postgresql or mysql can initiate
    'min': 0, // minimum connection which postgresql or mysql can initiate
    'acquire': 20000, // time require to reconnect
    'idle': 20000, // get idle connection
    'evict': 10000 // it actually removes the idle connection
  }
};
