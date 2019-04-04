import { getExtraContext, errorToFormattedStacktrace, getAwsApiKeyFromCompoundKey } from './util';

export async function reporter({ key, reportingUrl, error, seenAt, context }) {
    const body = {
        key,
        notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack plugin?),
        exceptionClass: error.constructor.name,
        seenAt,
        message: error.message,
        language: 'javascript',
        glows: [], // todo
        context: getExtraContext(context),
        stacktrace: await errorToFormattedStacktrace(error),
    };

    fetch(reportingUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'x-api-key': getAwsApiKeyFromCompoundKey(key),
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
}
