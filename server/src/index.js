import express from 'express';
import bodyParser from 'body-parser';

import { consumeStackframes } from './util';

const app = express()
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
        next();
    });

app.post('/', async (req, res) => {
    res.send('Hello World');

    console.log(req.body.stacktrace);

    consumeStackframes(req.body.stacktrace).then(res => {
        /* console.log('\nresult:', res); */
    }).catch(err => {
        console.log('error:', err);
    });
});

app.listen(3000);

console.log('Server listening on port 3000, run ngrok http 3000 to share this server publicly');
