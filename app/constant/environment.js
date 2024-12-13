require('dotenv').config();

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  API_KEY: process.env.API_KEY,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  RESET_ALL_BOOKINGS: process.env.RESET_ALL_BOOKINGS,
  DB_PORT:process.env.DB_PORT
};

module.exports = { env };
