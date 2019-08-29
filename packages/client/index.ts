import { getExtraContext, errorToFormattedStacktrace, getCurrentTime, flatJsonStringify, throwError } from './util';

interface Glow {
    time: Number;
    name: String;
    messageLevel: 'info' | 'debug' | 'warning' | 'error' | 'critical';
    metaData: Array<Object>;
}

interface Config {
    maxGlows: number;
    maxReportsPerMinute: number;
}

interface Context {
    request?: {
        url?: String;
        useragent?: String;
        referrer?: String;
        readyState?: String;
    };
    cookies?: Array<Object>;
    [key: string]: any;
}

declare const VERSION: string;

const clientVersion = typeof VERSION === 'undefined' ? '?' : VERSION;

type BeforeSubmit = (context: Context) => Context;

export default new (class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Glow>;
    config: Config;
    beforeSubmit: BeforeSubmit;
    reportedErrorsTimestamps: Array<number>;

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];
        this.beforeSubmit = (context: Context) => context;
        this.reportedErrorsTimestamps = [];

        this.config = {
            maxGlows: 10,
            maxReportsPerMinute: 10,
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
            throwError('No Flare key was passed, shutting down.');
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
                Run client.light('api-token-goes-here') when you initialise your app.
                If you are running in dev mode and didn't run the light command on purpose, you can ignore this error.`
            );
        }

        if (!error) {
            throwError('No error was provided, not reporting.');
        }

        if (this.reportedErrorsTimestamps.length >= this.config.maxReportsPerMinute) {
            const nErrorsBack = this.reportedErrorsTimestamps[
                this.reportedErrorsTimestamps.length - this.config.maxReportsPerMinute
            ];

            if (nErrorsBack > Date.now() - 60 * 1000) {
                // Too many errors reported in the last minute, not reporting this one.
                return;
            }
        }

        const body = {
            key: this.key,
            notifier: 'Flare JavaScript Client V' + clientVersion,
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

        this.reportedErrorsTimestamps.push(Date.now());
    }
})();
