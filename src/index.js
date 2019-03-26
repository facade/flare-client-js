import useVuePlugin from './integrations/vue';
import catchWindowErrors from './integrations/window';
import { getPlatformInfo, errorToFormattedStacktrace } from './util';

let reportingServerUrl;

const lightFlare = ({ serverUrl = '', withVue, Vue = window.Vue }) => {
    reportingServerUrl = serverUrl;
    if (!reportingServerUrl) {
        return;
    }

    if (withVue) {
        useVuePlugin(reportError, Vue);
    }

    catchWindowErrors(reportError);
};

const reportError = async function({ error, seenAt, context = {} }) {
    const notifier = 'Flare JavaScript Client V1.0'; // TODO: get version dynamically from package.json (webpack plugin?)
    const exceptionClass = error.constructor.name;
    const message = error.message;
    const language = 'javascript';
    const glows = [];
    const stacktrace = await errorToFormattedStacktrace(error);

    context.platform = getPlatformInfo();

    const body = {
        key: '',
        notifier,
        exceptionClass,
        seenAt,
        message,
        language,
        glows,
        context,
        stacktrace,
    };

    console.log(body);

    fetch(reportingServerUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
};

export default lightFlare;
