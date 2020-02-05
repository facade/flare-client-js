import { assert, now, flatJsonStringify } from './util';
import { collectContext } from './context';
import { createStackTrace } from './stacktrace';
import build from './build';
import getSolutions from './solutions';

export default class FlareClient {
    config: Flare.Config = {
        key: '',
        reportingUrl: 'https://flareapp.io/api/reports',
        maxGlowsPerReport: 30,
        maxReportsPerMinute: 500,
    };

    glows: Array<Flare.Glow> = [];

    context: Flare.Context = { context: {} };

    beforeEvaluate: Flare.BeforeEvaluate = error => error;

    beforeSubmit: Flare.BeforeSubmit = report => report;

    reportedErrorsTimestamps: Array<number> = [];

    solutionProviders: Array<Flare.SolutionProvider> = [];

    sourcemapVersion: string = build.sourcemapVersion;

    light(key: string = build.flareJsKey): FlareClient {
        if (
            !assert(
                key,
                'No Flare key was passed, errors will not be reported. If this is a development environment, this is expected behaviour.'
            ) ||
            !assert(Promise, 'ES6 promises are not supported in this environment, errors will not be report.')
        ) {
            this.beforeEvaluate = () => false;

            return this;
        }

        this.config.key = key;

        return this;
    }

    glow(name: string, level: Flare.MessageLevel = 'info', metaData: Array<object> = []): FlareClient {
        const time = now();

        this.glows.push({
            name,
            message_level: level,
            meta_data: metaData,
            time,
            microtime: time,
        });

        if (this.glows.length > this.config.maxGlowsPerReport) {
            this.glows = this.glows.slice(this.glows.length - this.config.maxGlowsPerReport);
        }

        return this;
    }

    addContext(name: string, value: any): FlareClient {
        this.context.context[name] = value;

        return this;
    }

    addContextGroup(groupName: string, value: object): FlareClient {
        this.context[groupName] = value;

        return this;
    }

    registerSolutionProvider(provider: Flare.SolutionProvider): FlareClient {
        if (
            !assert('canSolve' in provider, 'A solution provider without a [canSolve] property was added.') ||
            !assert('getSolutions' in provider, 'A solution provider without a [getSolutions] property was added.')
        ) {
            return this;
        }

        this.solutionProviders.push(provider);

        return this;
    }

    report(
        error: Error,
        context: Flare.Context = {},
        extraSolutionParameters: Flare.SolutionProviderExtraParameters = {}
    ): void {
        Promise.resolve(this.beforeEvaluate(error)).then(reportReadyForEvaluation => {
            if (!reportReadyForEvaluation) {
                return;
            }

            this.createReport(error, context, extraSolutionParameters).then(report =>
                report ? this.sendReport(report) : {}
            );
        });
    }

    createReport(
        error: Error,
        context: Flare.Context = {},
        extraSolutionParameters: Flare.SolutionProviderExtraParameters = {}
    ): Promise<Flare.ErrorReport | false> {
        if (!assert(error, 'No error provided.')) {
            return Promise.resolve(false);
        }

        const seenAt = now();

        return Promise.all([
            getSolutions(this.solutionProviders, error, extraSolutionParameters),
            createStackTrace(error),
        ]).then(result => {
            const [solutions, stacktrace] = result;

            assert(stacktrace, "Couldn't generate stacktrace.");

            return {
                notifier: `Flare JavaScript client v${build.clientVersion}`,
                exception_class: error.constructor && error.constructor.name ? error.constructor.name : 'undefined',
                seen_at: seenAt,
                message: error.message,
                language: 'javascript',
                glows: this.glows,
                context: collectContext({ ...context, ...this.context }),
                stacktrace,
                sourcemap_version_id: this.sourcemapVersion,
                solutions,
            };
        });
    }

    sendReport(report: Flare.ErrorReport): void {
        if (
            !assert(
                this.config.key,
                'The client was not yet initialised with an API key. ' +
                    "Run client.light('<api-token>') when you initialise your app. " +
                    "If you are running in dev mode and didn't run the light command on purpose, you can ignore this error."
            )
        ) {
            return;
        }

        if (this.maxReportsPerMinuteReached()) {
            return;
        }

        Promise.resolve(this.beforeSubmit(report)).then(reportReadyForSubmit => {
            if (!reportReadyForSubmit) {
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.config.reportingUrl);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('x-api-token', this.config.key);

            xhr.send(flatJsonStringify({ ...reportReadyForSubmit, key: this.config.key }));

            this.reportedErrorsTimestamps.push(Date.now());
        });
    }

    maxReportsPerMinuteReached(): boolean {
        if (this.reportedErrorsTimestamps.length >= this.config.maxReportsPerMinute) {
            const nErrorsBack = this.reportedErrorsTimestamps[
                this.reportedErrorsTimestamps.length - this.config.maxReportsPerMinute
            ];

            if (nErrorsBack > Date.now() - 60 * 1000) {
                return true;
            }
        }

        return false;
    }

    test(): FlareClient {
        this.report(new Error('The Flare client is set up correctly!'));

        return this;
    }
}
