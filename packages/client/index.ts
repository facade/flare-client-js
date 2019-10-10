import {
    getExtraContext,
    errorToFormattedStacktrace,
    getCurrentTime,
    flatJsonStringify,
    flareLog,
    flatMap,
} from './util';
import { clientVersion, flareSourcemapVersion } from './util/globals';

export default new (class FlareClient {
    key: string;
    reportingUrl: string;
    glows: Array<Flare.Glow>;
    throttleConfig: Flare.ThrottleConfig;
    reportedErrorsTimestamps: Array<number>;
    customContext: { [key: string]: any };
    beforeSubmit?: (report: Flare.ErrorReport) => Flare.ErrorReport | false;
    solutionProviders: Array<Flare.SolutionProvider>;

    constructor() {
        this.key = '';
        this.reportingUrl = '';
        this.glows = [];
        this.reportedErrorsTimestamps = [];
        this.customContext = { context: {} };
        this.beforeSubmit = undefined;
        this.solutionProviders = [];

        this.throttleConfig = {
            maxGlows: 30,
            maxReportsPerMinute: 500,
        };
    }

    public setConfig(newConfig: Flare.ThrottleConfig): void {
        this.throttleConfig = { ...this.throttleConfig, ...newConfig };
    }

    public light(key: string, reportingUrl: string): void {
        if (!key) {
            flareLog('No Flare key was passed, shutting down.');
        }

        if (!reportingUrl) {
            flareLog('No reportingUrl was passed, shutting down.');
        }

        if (!Promise) {
            flareLog('ES6 Promises are not supported in this environment, shutting down.');
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
    }): void {
        this.glows.push({ microtime: time, time, name, message_level: messageLevel, meta_data: metaData });

        if (this.glows.length > this.throttleConfig.maxGlows) {
            this.glows = this.glows.slice(this.glows.length - this.throttleConfig.maxGlows);
        }
    }

    public addContext(name: string, value: any): void {
        this.customContext.context[name] = value;
    }

    public addContextGroup(groupName: string, value: { [key: string]: any }): void {
        this.customContext[groupName] = value;
    }

    public registerSolutionProvider(solutionProvider: Flare.SolutionProvider): void {
        if (!solutionProvider.canSolve || !solutionProvider.getSolutions) {
            return flareLog('A solution provider without a "canSolve" or "getSolutions" property was added.');
        }

        this.solutionProviders.push(solutionProvider);
    }

    public reportError(error: Error, context: Flare.Context = {}): void {
        if (!this.key || !this.reportingUrl) {
            flareLog(
                `The client was not yet initialised with an API key.
                Run client.light('api-token-goes-here') when you initialise your app.
                If you are running in dev mode and didn't run the light command on purpose, you can ignore this error.`
            );
        }

        if (!error) {
            flareLog('No error was provided, not reporting.');
        }

        if (this.reportedErrorsTimestamps.length >= this.throttleConfig.maxReportsPerMinute) {
            const nErrorsBack = this.reportedErrorsTimestamps[
                this.reportedErrorsTimestamps.length - this.throttleConfig.maxReportsPerMinute
            ];

            if (nErrorsBack > Date.now() - 60 * 1000) {
                // Too many errors reported in the last minute, not reporting this one.
                return;
            }
        }

        errorToFormattedStacktrace(error).then(stacktrace => {
            if (!stacktrace) {
                flareLog('No error stack was found, not reporting the error.');
            }

            let report: Flare.ErrorReport = {
                key: this.key,
                notifier: 'Flare JavaScript Client V' + clientVersion,
                exception_class:
                    error.constructor && error.constructor.name ? error.constructor.name : 'undefined exception class',
                seen_at: getCurrentTime(),
                message: error.message,
                language: 'javascript',
                glows: this.glows,
                context: getExtraContext({ ...context, ...this.customContext }),
                stacktrace,
                sourcemap_version_id: flareSourcemapVersion,
                solutions: flatMap(this.solutionProviders, provider =>
                    provider.canSolve(error) ? provider.getSolutions(error) : []
                ),
            };

            if (this.beforeSubmit) {
                const newReport = this.beforeSubmit(report);

                if (!newReport) {
                    return;
                }

                report = newReport;
            }

            // TODO: send report through trimming strategy (will probably have to flatten the JSON here, and stringify it later, before sending)

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.reportingUrl);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('x-api-key', this.key);
            xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

            xhr.send(flatJsonStringify(report));

            this.reportedErrorsTimestamps.push(Date.now());
        });
    }
})();
