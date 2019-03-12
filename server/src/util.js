import { SourceMapConsumer } from 'source-map';
import { map as asyncMap } from 'async/map';
import fs from 'fs';

export async function consumeStackframes(stackframes) {
    return new Promise(resolve => {
        // TODO: needs to be async forEach
        const consumedStackframes = [];

        // TODO: finish this using correct async.map syntax: https://caolan.github.io/async/docs.html#map
        asyncMap(
            stackframes,
            (frame, callback) => {
                const fileName = frame.fileName.split('/').slice(-1);

                fs.readFile(`./sourcemaps/${fileName}.map`, 'utf8', async function(err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const consumer = await new SourceMapConsumer(JSON.parse(data));

                    const originalPosition = consumer.originalPositionFor({
                        line: frame.lineNumber,
                        column: frame.columnNumber,
                    });

                    consumedStackframes.push(originalPosition);

                    callback();
                });
            },
            err => {
                if (err) {
                    console.error('A file failed to process');
                } else {
                    resolve(consumedStackframes);
                }
            }
        );

        /* stackframes.forEach(frame => {
            const fileName = frame.fileName.split('/').slice(-1);

            fs.readFile(`./sourcemaps/${fileName}.map`, 'utf8', async function(err, data) {
                if (err) {
                    console.error(err);
                    return;
                }

                const consumer = await new SourceMapConsumer(JSON.parse(data));

                const originalPosition = consumer.originalPositionFor({
                    line: frame.lineNumber,
                    column: frame.columnNumber,
                });

                console.log(originalPosition);
                resolve('kek');
            });
        }); */

        /* resolve('consumedStackframes'); */
    });
}
