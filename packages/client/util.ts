import ErrorStackParser from 'error-stack-parser';
import { Context } from '.';

declare const VERSION: string;

const clientVersion = typeof VERSION === 'undefined' ? '?' : VERSION;

export function errorToFormattedStacktrace(error: Error) {
    if (!hasStack(error)) {
        throwError('No error stack was found, not reporting the error.');
    }

    return ErrorStackParser.parse(error).map(frame => ({
        line_number: frame.lineNumber || 1,
        column_number: frame.columnNumber || 1,
        method: frame.functionName || 'Anonymous or unknown function',
        file: frame.fileName || 'Unknown file',
        code_snippet: [],
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
        context.cookies = document.cookie.split('; ').reduce(
            (cookies, cookie) => {
                const [cookieName, cookieValue] = cookie.split(/=/);
                cookies[cookieName] = cookieValue;

                return cookies;
            },
            {} as { [key: string]: string }
        );
    }

    if (location.search) {
        const queryString: { [key: string]: string } = {};

        new URLSearchParams(location.search).forEach((value, key) => {
            queryString[key] = value;
        });

        context.request_data = { queryString };
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
    console.error(`Flare JS Client V${clientVersion}: ${errorMessage}`);
}

function hasStack(err: any) {
    return (
        !!err &&
        (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
        typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
        err.stack !== `${err.name}: ${err.message}`
    );
}
