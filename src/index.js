import calendarRouter from './calendar.router';
import express from 'express'
import bodyParser from 'body-parser';
const app = express()
const port = 8081

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.use(allowCrossDomain);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use('/api/web', calendarRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))