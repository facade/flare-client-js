import { getExtraContext, errorToFormattedStacktrace, getCurrentTime, flatJsonStringify, throwError } from './util';

interface Glow {
    time: Number;
    name: String;
    messageLevel: 'info' | 'debug' | 'warning' | 'error' | 'critical';
    metaData: Array<Object>;
}

interface Config {
    maxGlows: number;
    maxReportsPerSession?: number;
}

export default new class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Glow>;
    config: Config;

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];

        this.config = {
            maxGlows: 10,
            maxReportsPerSession: 5, // TODO: https://github.com/spatie/flare-client-js/issues/28
        };
    }

    setConfig(newConfig: Config) {
        // TODO: Figure out a clean way to set a min & max for each option, eg https://github.com/bugsnag/bugsnag-js/blob/master/packages/core/config.js
        this.config = { ...this.config, ...newConfig };
    }

    light(key: string, reportingUrl: string) {
        if (!key) {
            throwError('No Flare key was passed, shutting down. Find your token at https://flare.laravel.com/settings');
        }

        if (!reportingUrl) {
            throwError('No reportingUrl was passed, shutting down.');
        }

        this.key = key;
        this.reportingUrl = reportingUrl;
    }

    glow({ name, messageLevel = 'info', metaData = [], time = getCurrentTime() }: Glow) {
        this.glows.push({ time, name, messageLevel, metaData });

        if (this.glows.length > this.config.maxGlows) {
            this.glows = this.glows.slice(this.glows.length - this.config.maxGlows);
        }
    }

    reportError(error: Error, context = {}) {
        if (!this.key || !this.reportingUrl) {
            throwError(
                `The client was not yet initialised with an API key.
                Run client.light('api-token-goes-here') towards the start of your app.`
            );
        }

        if (!error) {
            throwError('No error was provided, not reporting.');
        }

        const stacktrace = errorToFormattedStacktrace(error);

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
    }
}();
