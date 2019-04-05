import { getExtraContext, errorToFormattedStacktrace, getAwsApiKeyFromCompoundKey, formatTime } from './util';
import { flareClient } from './index';

export function reportError({ error, seenAt, context }) {
    errorToFormattedStacktrace(error).then(stacktrace => {
        const body = {
            key: flareClient.key,
            notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack plugin?),
            exceptionClass: error.constructor.name,
            seenAt: formatTime(seenAt),
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
        xhr.setRequestHeader('x-api-key', getAwsApiKeyFromCompoundKey(flareClient.key));
        xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        xhr.send(JSON.stringify(body));
    });
}
