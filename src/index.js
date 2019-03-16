import calendarRouter from './calendar.router';
import express from 'express'
import bodyParser from 'body-parser';
import { WHITELIST_CORS_URLS, PORT } from './constants';
const app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', WHITELIST_CORS_URLS.join());
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use('/api/web', calendarRouter);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))