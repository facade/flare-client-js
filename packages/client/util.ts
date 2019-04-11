import ErrorStackParser from 'error-stack-parser';
import StackGenerator from 'stack-generator';

interface Context {
    request?: {
        url: String;
        useragent: String;
        referrer: String;
        readyState: String;
    };
    cookies?: Array<Object>;
}

// https://github.com/bugsnag/bugsnag-js/blob/9a49dc0bdc6dc8bb13a74631c3426778e9c49c9f/packages/core/report.js#L154
export function errorToFormattedStacktrace(error: Error) {
    const parsedStack = hasStack(error)
        ? ErrorStackParser.parse(error)
        : StackGenerator.backtrace()
              .filter(frame => (frame.functionName || '').indexOf('StackGenerator$$') === -1)
              .slice(1);

    return parsedStack.map(frame => ({
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber,
        method: frame.functionName,
        file: frame.fileName,
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

    context.cookies = document.cookie.split('; ').map(cookie => {
        const splitCookie = cookie.split(/=/);
        return { [splitCookie[0]]: splitCookie[1] };
    });

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

// https://github.com/bugsnag/bugsnag-js/blob/9a49dc0bdc6dc8bb13a74631c3426778e9c49c9f/packages/core/lib/has-stack.js
function hasStack(err: any) {
    return (
        !!err &&
        (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
        typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
        err.stack !== `${err.name}: ${err.message}`
    );
}
