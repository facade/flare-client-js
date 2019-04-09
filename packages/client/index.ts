import { getExtraContext, errorToFormattedStacktrace, getCurrentTime } from './util';

export default class FlareClient {
    key: string;
    reportingUrl: string;

    constructor(key: string, reportingUrl: string) {
        if (!key) {
            throw new Error(
                'Flare JS Client: no Flare key was passed, shutting down. Find your token at https://flare.laravel.com/settings'
            );
        }

        if (!reportingUrl) {
            throw new Error('Flare JS Client: no reportingUrl was passed, shutting down.');
        }

        this.key = key;
        this.reportingUrl = reportingUrl;
    }

    reportError(error: Error, context = {}) {
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
                key: this.key,
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
            xhr.open('POST', this.reportingUrl);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('x-api-key', this.key);
            xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

            xhr.send(JSON.stringify(body));
        });
    }
}
