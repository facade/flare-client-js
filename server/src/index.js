import express from 'express';
import bodyParser from 'body-parser';

import { consumeStackframes } from './util';

const app = express()
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

app.post('/', async (req, res) => {
    res.send('Hello World');

    console.log(req.body);

    /* consumeStackframes(req.body.report.stacktrace).then(res => {
        console.log('result:', res);
    }).catch(err => {
        console.log('error:', err);
    }); */
});

app.listen(3000);
