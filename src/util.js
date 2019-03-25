import StackTrace from 'stacktrace-js';
import platform from 'platform';
import { default as asyncMap } from 'async/map';
/* import sourceMapResolve from 'source-map-resolve'; */
/* import { SourceMapConsumer } from 'source-map'; */

//https://stackoverflow.com/a/44082344/6374824
export function kebabToPascal(str) {
    str += '';
    str = str.split('-');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length);
    }
    return str.join('');
}

export function errorToFormattedStacktrace(error) {
    return new Promise(async function(resolve) {
        const stacktrace = await StackTrace.fromError(error);



        const formattedStacktrace = stacktrace.map(frame => {
            const resolvedFrame = resolveStacktrace(frame);

            const codeSnippet = [];

            return {
                lineNumber: resolvedFrame.lineNumber,
                columnNumber: resolvedFrame.columnNumber,
                method: resolvedFrame.functionName,
                codeSnippet,
                file: resolvedFrame.fileName,
            };
        });

        resolve(formattedStacktrace);
    });
}

function resolveStacktrace(stacktrace) {
    return new Promise(resolve => {
        asyncMap(
            stacktrace,
            async function (frame, callback) {
                const fileName = frame.fileName;

                // TODO: read file

                if (err || !data) {
                    // Return original, unresolved frame
                    callback(null, frame);
                    return;
                }

                const consumer = await new SourceMapConsumer(JSON.parse(data));
                const originalPosition = consumer.originalPositionFor({
                    line: frame.lineNumber,
                    column: frame.columnNumber,
                });

                callback(null, originalPosition);

            },
            (err, results) => {
                resolve(results || stacktrace);
            }
        );
    });
}

export function getPlatformInfo() {
    return platform;
}

export function getCurrentEpochTime() {
    return Math.round(new Date() / 1000);
}
