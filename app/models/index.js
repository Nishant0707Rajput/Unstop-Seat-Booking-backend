const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { env } = require('../constant/environment');
const node_env = env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.js'))[node_env];
const db = {};
const sequelize = new Sequelize(config);
fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error.message);
  });

sequelize.sync({ force: false, alter: true, logging: false })
  .then(() => {
    console.log(`DB_NAME & tables created!`);
  }).catch((error) => {
    console.log('catchError>>>>>>>>', error);
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
