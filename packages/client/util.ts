import ErrorStackParser from 'error-stack-parser';

export function errorToFormattedStacktrace(error: Error) {
    if (!hasStack(error)) {
        throwError('No error stack was found, not reporting the error.');
    }

    return ErrorStackParser.parse(error).map(frame => ({
        lineNumber: frame.lineNumber || 1,
        columnNumber: frame.columnNumber || 1,
        method: frame.functionName || 'Anonymous or unknown function',
        file: frame.fileName || 'Unknown file',
    }));
}

export function getCurrentTime() {
    return Math.round(Date.now() / 1000);
}

export function getExtraContext(context: Context) {
    context.request = {
        url: document.location.href,
        useragent: navigator.userAgent,
        referrer: document.referrer,
        readyState: document.readyState,
    };

    if (document.cookie) {
        context.cookies = document.cookie.split('; ').map(cookie => {
            const splitCookie = cookie.split(/=/);
            return { [splitCookie[0]]: splitCookie[1] };
        });
    }

    return context;
}

// https://stackoverflow.com/a/11616993/6374824
export function flatJsonStringify(json: Object) {
    let cache: any = [];

    const flattenedStringifiedJson = JSON.stringify(json, function(_, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                try {
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    return;
                }
            }
            cache.push(value);
        }
        return value;
    });

    cache = null;

    return flattenedStringifiedJson;
}

export function throwError(errorMessage: string) {
    throw new Error(`Flare JS Client V${VERSION}: ${errorMessage}`);
}

// https://github.com/bugsnag/bugsnag-js/blob/9a49dc0bdc6dc8bb13a74631c3426778e9c49c9f/packages/core/lib/has-stack.js
function hasStack(err: any) {
    return (
        !!err &&
        (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
        typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
        err.stack !== `${err.name}: ${err.message}`
    );
}
