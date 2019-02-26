import express from 'express';
import calendarController from './calendar.controller'

const calendarRouter = express.Router();
const baseRoute = '/calendar';

calendarRouter.get(`${baseRoute}`, function (req, res) {
    const webCon = new calendarController();
    webCon.init(req, res);
});

calendarRouter.post(`${baseRoute}`, function (req, res) {
    const webCon = new calendarController();
    webCon.setCode(req, res);
});

export default calendarRouter
