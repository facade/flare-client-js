import { getExtraContext, errorToFormattedStacktrace, getCurrentTime, flatJsonStringify, throwError } from './util';

interface Glow {
    time: Number;
    name: String;
    messageLevel: 'info' | 'debug' | 'warning' | 'error' | 'critical';
    metaData: Array<Object>;
}

interface Config {
    maxGlows: number;
    maxReportsPerMinute?: number;
}

type BeforeSubmit = (context: Context) => Context;

export default new (class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Glow>;
    config: Config;
    beforeSubmit: BeforeSubmit;

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];
        this.beforeSubmit = (context: Context) => context;

        this.config = {
            maxGlows: 10,
            maxReportsPerMinute: 10, // TODO: https://github.com/spatie/flare-client-js/issues/28
        };
    }

    public setBeforeSubmit(newBeforeSubmit: BeforeSubmit) {
        if (typeof newBeforeSubmit === 'function') {
            this.beforeSubmit = newBeforeSubmit;
        }
    }

    public setConfig(newConfig: Config) {
        // TODO: Figure out a clean way to set a min & max for each option, eg https://github.com/bugsnag/bugsnag-js/blob/master/packages/core/config.js
        this.config = { ...this.config, ...newConfig };
    }

    public light(key: string, reportingUrl: string) {
        if (!key) {
            throwError('No Flare key was passed, shutting down. Find your token at https://flare.laravel.com/settings');
        }

        if (!reportingUrl) {
            throwError('No reportingUrl was passed, shutting down.');
        }

        this.key = key;
        this.reportingUrl = reportingUrl;
    }

    public glow({ name, messageLevel = 'info', metaData = [], time = getCurrentTime() }: Glow) {
        this.glows.push({ time, name, messageLevel, metaData });

        if (this.glows.length > this.config.maxGlows) {
            this.glows = this.glows.slice(this.glows.length - this.config.maxGlows);
        }
    }

    public reportError(error: Error, context = {}) {
        if (!this.key || !this.reportingUrl) {
            throwError(
                `The client was not yet initialised with an API key.
                Run client.light('api-token-goes-here') when you initialise your app.`
            );
        }

        if (!error) {
            throwError('No error was provided, not reporting.');
        }

        const body = {
            key: this.key,
            notifier: 'Flare JavaScript Client V' + VERSION,
            exceptionClass: error.constructor ? error.constructor.name : undefined,
            seenAt: getCurrentTime(),
            message: error.message,
            language: 'javascript',
            glows: this.glows,
            context: this.beforeSubmit(getExtraContext(context)),
            stacktrace: errorToFormattedStacktrace(error),
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.reportingUrl);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('x-api-key', this.key);
        xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        xhr.send(flatJsonStringify(body));
    }
})();
