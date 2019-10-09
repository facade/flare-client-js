import { getExtraContext, errorToFormattedStacktrace, getCurrentTime, flatJsonStringify, throwError } from './util';
import { clientVersion, flareSourcemapVersion } from './util/globals';

export default new (class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Flare.Glow>;
    config: Flare.ClientConfig;
    reportedErrorsTimestamps: Array<number>;
    customContext: { [key: string]: any };

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];
        this.reportedErrorsTimestamps = [];
        this.customContext = { context: {} };

        this.config = {
            maxGlows: 30,
            maxReportsPerMinute: 500,
        };
    }

    public setConfig(newConfig: Flare.ClientConfig) {
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

    public glow({
        name,
        messageLevel = 'info',
        metaData = [],
        time = Math.round(Date.now() / 1000),
    }: {
        name: Flare.Glow['name'];
        messageLevel?: Flare.Glow['message_level'];
        metaData?: Flare.Glow['meta_data'];
        time?: Flare.Glow['time'];
    }) {
        this.glows.push({ microtime: time, time, name, message_level: messageLevel, meta_data: metaData });

        if (this.glows.length > this.config.maxGlows) {
            this.glows = this.glows.slice(this.glows.length - this.config.maxGlows);
        }
    }

    public addContext(name: string, value: any) {
        this.customContext.context[name] = value;
    }

    public addContextGroup(groupName: string, value: { [key: string]: any }) {
        this.customContext[groupName] = value;
    }

    public reportError(error: Error, context: Flare.Context = {}) {
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

        errorToFormattedStacktrace(error).then(stacktrace => {
            if (!stacktrace) {
                throwError('No error stack was found, not reporting the error.');
            }

            const body = {
                key: this.key,
                notifier: 'Flare JavaScript Client V' + clientVersion,
                exception_class: error.constructor ? error.constructor.name : undefined,
                seen_at: getCurrentTime(),
                message: error.message,
                language: 'javascript',
                glows: this.glows,
                context: getExtraContext({ ...context, ...this.customContext }),
                stacktrace,
                sourcemap_version_id: flareSourcemapVersion,
            };

            // TODO: send request body through trimming strategy (will probably have to flatten the JSON here, and stringify it later, before sending)

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.reportingUrl);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('x-api-key', this.key);
            xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

            xhr.send(flatJsonStringify(body));

            this.reportedErrorsTimestamps.push(Date.now());
        });
    }
})();
