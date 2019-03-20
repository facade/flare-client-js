import { SourceMapConsumer } from 'source-map';
import { default as asyncMap } from 'async/map';
import fs from 'fs';

export async function consumeStackframes(stackframes) {
    /* console.log(stackframes); */
    return new Promise((resolve, reject) => {
        asyncMap(
            stackframes,
            (frame, callback) => {
                const fileName = frame.fileName.split('/').slice(-1);

                fs.readFile(`./sourcemaps/${fileName}.map`, 'utf8', async function(err, data) {
                    if (err || !data) {
                        callback(null, frame);

                        return;
                    }

                    const consumer = await new SourceMapConsumer(JSON.parse(data));
                    const originalPosition = consumer.originalPositionFor({
                        line: frame.lineNumber,
                        column: frame.columnNumber,
                    });

                    callback(null, originalPosition);
                });
            },
            (err, results) => {
                if (err) {
                    reject('A file or stackframe failed to process:', err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
