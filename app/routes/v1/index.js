const app = require('express')();
const { verifyApiKey } = require('../../middleware/auth');

app.use(verifyApiKey);
app.use('/seat', require('./seat'));

module.exports = app;
