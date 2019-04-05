import { getExtraContext, errorToFormattedStacktrace, getAwsApiKeyFromCompoundKey, formatTime } from './util';
import { flareClient } from './index';

export async function reportError({ error, seenAt, context }) {
    const body = {
        key: flareClient.key,
        notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack plugin?),
        exceptionClass: error.constructor.name,
        seenAt: formatTime(seenAt),
        message: error.message,
        language: 'javascript',
        glows: [], // todo
        context: getExtraContext(context),
        stacktrace: await errorToFormattedStacktrace(error),
    };

    fetch(flareClient.reportingUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'x-api-key': getAwsApiKeyFromCompoundKey(flareClient.key),
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
}
