import StackTrace from 'stacktrace-js';
import platform from 'platform';

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
            const codeSnippet = [];

            return {
                lineNumber: frame.lineNumber,
                columnNumber: frame.columnNumber,
                method: frame.functionName,
                codeSnippet,
                file: frame.fileName,
            };
        });

        resolve(formattedStacktrace);
    });
}

export function getPlatformInfo() {
    return platform;
}

export function getCurrentEpochTime() {
    return Math.round(new Date() / 1000);
}
