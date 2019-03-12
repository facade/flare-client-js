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

app.post('/', (req, res) => {
    res.send('Hello World');
    /* console.log(req.body); */

    consumeStackframes(req.body.stackframes).then(answer => console.log(answer));
});

app.listen(3000);
