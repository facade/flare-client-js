import { getExtraContext, errorToFormattedStacktrace, getCurrentTime, flatJsonStringify } from './util';

interface Glow {
    time: Number;
    name: String;
    messageLevel: 'info' | 'debug' | 'warning' | 'error' | 'critical';
    metaData: Array<Object>;
}

export default new class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Glow>;
    config: {
        maxGlows: number;
    };

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];

        this.config = {
            maxGlows: 10,
        };
    }

    light(key: String, reportingUrl: string) {
        if (!key) {
            throw new Error(
                `Flare JS Client: No Flare key was passed, shutting down.
                Find your token at https://flare.laravel.com/settings`
            );
        }

        if (!reportingUrl) {
            throw new Error(`Flare JS Client: No reportingUrl was passed, shutting down.`);
        }

        this.key = key;
        this.reportingUrl = reportingUrl;
    }

    glow({ time = getCurrentTime(), name, messageLevel = 'info', metaData = [] }: Glow) {
        this.glows.push({ time, name, messageLevel, metaData });

        if (this.glows.length > this.config.maxGlows) {
            this.glows = this.glows.slice(this.glows.length - this.config.maxGlows);
        }
    }

    reportError(error: Error, context = {}) {
        if (!this.key || !this.reportingUrl) {
            throw new Error(
                `Flare JS Client: The client was not yet initialised with an API key.
                Run client.light('api-token-goes-here') towards the start of your app.`
            );
        }

        if (!error.message) {
            throw new Error(
                `Flare JS Client: The error object that was passed to
                flareClient.reportError() does not have a message key.
                This error will not be reported to the server.`
            );
        }

        errorToFormattedStacktrace(error).then(stacktrace => {
            const body = {
                key: this.key,
                notifier: 'Flare JavaScript Client V' + VERSION,
                exceptionClass: error.constructor ? error.constructor.name : undefined,
                seenAt: getCurrentTime(),
                message: error.message,
                language: 'javascript',
                glows: this.glows,
                context: getExtraContext(context),
                stacktrace: stacktrace,
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.reportingUrl);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('x-api-key', this.key);
            xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

            xhr.send(flatJsonStringify(body));
        });
    }
}();
