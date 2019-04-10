import StackTrace from 'stacktrace-js';

interface Context {
    request?: {
        url: String;
        useragent: String;
        referrer: String;
        readyState: String;
    };
    cookies?: Array<Object>;
}

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
