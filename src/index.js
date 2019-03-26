import useVuePlugin from './integrations/vue';
import catchWindowErrors from './integrations/window';
import { errorToFormattedStacktrace, getContext } from './util';

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
    const body = {
        key: '',
        notifier: 'Flare JavaScript Client V1.0', // TODO: get version dynamically from package.json (webpack plugin?),
        exceptionClass: error.constructor.name,
        seenAt,
        message: error.message,
        language: 'javascript',
        glows: [], // todo
        context: getContext(context),
        stacktrace: await errorToFormattedStacktrace(error),
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
