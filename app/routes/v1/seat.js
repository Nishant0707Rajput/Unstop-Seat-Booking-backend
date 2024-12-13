const routes = require('express').Router();
const controller = require('../../controller/seat');

routes.post('/book',controller.bookSeats);
routes.post('/initialize-seats',controller.reInitializeSeats);
routes.get('/', controller.getAllSeats);

module.exports = routes;
