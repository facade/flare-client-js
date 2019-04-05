import StackTrace from 'stacktrace-js';

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

export function formatTime(date) {
    return Math.round(date / 1000);
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

export function getAwsApiKeyFromCompoundKey(compoundKey) {
    const compountKeyPieces = compoundKey.split('---');

    return compountKeyPieces[0];
}
