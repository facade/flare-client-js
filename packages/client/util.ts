import StackTrace from 'stacktrace-js';
import { Context } from './reporter';

export function errorToFormattedStacktrace(error: Error) {
    return new Promise(resolve => {
        StackTrace.fromError(error).then(stacktrace => {
            const formattedStacktrace = stacktrace.map(frame => ({
                lineNumber: frame.lineNumber,
                columnNumber: frame.columnNumber,
                method: frame.functionName,
                file: frame.fileName,
            }));

            resolve(formattedStacktrace);
        });
    });
}

export function formatTime(date: number) {
    return Math.round(date / 1000);
}

export function getExtraContext(context: Context = {}) {
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

export function getAwsApiKeyFromCompoundKey(compoundKey: String) {
    const compountKeyPieces = compoundKey.split('---');

    return compountKeyPieces[0];
}
