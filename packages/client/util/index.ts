import ErrorStackParser from 'error-stack-parser';
import { getCodeSnippet } from './fileReader';
import { clientVersion, flareGitInfo, flareSourcemapVersion } from './globals';

export function errorToFormattedStacktrace(error: Error): Promise<Array<Flare.StackFrame>> {
    return new Promise((resolve, reject) => {
        if (!hasStack(error)) {
            return reject(undefined);
        }

        Promise.all(
            ErrorStackParser.parse(error).map(frame => {
                return new Promise<Flare.StackFrame>(resolve => {
                    getCodeSnippet(frame.fileName, frame.lineNumber, frame.columnNumber).then(snippet => {
                        resolve({
                            line_number: frame.lineNumber || 1,
                            column_number: frame.columnNumber || 1,
                            method: frame.functionName || 'Anonymous or unknown function',
                            file: frame.fileName || 'Unknown file',
                            code_snippet: snippet.codeSnippet,
                            trimmed_column_number: snippet.trimmedColumnNumber,
                            class: '',
                        });
                    });
                });
            })
        ).then(resolve);
    });
}

export function getCurrentTime(): number {
    return Math.round(Date.now() / 1000);
}

export function getExtraContext(context: Flare.Context): Flare.Context {
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

    context.git = flareGitInfo;

    return context;
}

// https://stackoverflow.com/a/11616993/6374824
export function flatJsonStringify(json: Object): string {
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

export function flareLog(errorMessage: string): void {
    console.error(`Flare JS Client V${clientVersion}: ${errorMessage}`);
}

function hasStack(err: any): boolean {
    return (
        !!err &&
        (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
        typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
        err.stack !== `${err.name}: ${err.message}`
    );
}

export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return Array.prototype.concat(...array.map(callbackfn));
}

export { clientVersion, flareGitInfo, flareSourcemapVersion };

export { default as launchIgnition } from './ignition';
