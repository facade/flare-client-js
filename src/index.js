import useVuePlugin from './integrations/vue';
import catchWindowErrors from './integrations/window';

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

const reportError = report => {
    fetch(reportingServerUrl, {
        method: 'POST',
        body: JSON.stringify(report),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
};

export default lightFlare;
