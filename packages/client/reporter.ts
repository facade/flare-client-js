import { getExtraContext, errorToFormattedStacktrace, getCurrentTime } from './util';
import { flareClient } from './index';

export interface Context {
    request?: {
        url: String;
        useragent: String;
        referrer: String;
        readyState: String;
    };
    cookies?: Array<Object>;
}

export function reportError(error: Error, context: Context = {}) {
    if (!error.message) {
        console.error(
            `Flare JS Client: the error object that was passed to
            flareClient.reportError() does not have a message key.
            This error will not be reported to the server.`
        );
        return;
    }

    errorToFormattedStacktrace(error).then(stacktrace => {
        const body = {
            key: flareClient.key,
            notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack env plugin?),
            exceptionClass: error.constructor ? error.constructor.name : undefined,
            seenAt: getCurrentTime(),
            message: error.message,
            language: 'javascript',
            glows: [], // todo
            context: getExtraContext(context),
            stacktrace: stacktrace,
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', flareClient.reportingUrl);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('x-api-key', flareClient.key);
        xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        xhr.send(JSON.stringify(body));
    });
}
