import StackTrace from 'stacktrace-js';

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

// Adapted from bugsnag: https://github.com/bugsnag/bugsnag-js/blob/c2020c6522fc075d284ad9441bbde8be155450d2/packages/plugin-react/src/index.js#L38-L45
export function formatReactComponentStack(stack) {
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}

export function getCurrentEpochTime() {
    return Math.round(new Date() / 1000);
}

export function getExtraContext(context) {
    context.request = {
        url: document.location.href,
        useragent: navigator.userAgent,
        referrer: document.referrer,
        readyState: document.readyState,
    };

    context.cookies = document.cookie.split('; ').map(cookie => {
        const splitCookie = cookie.split(/=/);
        return { [splitCookie[0]]: splitCookie[1] };
    });

    return context;
}

export async function reporter({ reportingUrl, key, error, seenAt, context }) {
    const body = {
        key,
        notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack plugin?),
        exceptionClass: error.constructor.name,
        seenAt,
        message: error.message,
        language: 'javascript',
        glows: [], // todo
        context: getExtraContext(context),
        stacktrace: await errorToFormattedStacktrace(error),
    };

    fetch(reportingUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
}
