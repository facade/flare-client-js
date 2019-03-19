import useVuePlugin from './integrations/vue';
import catchWindowErrors from './integrations/window';
import { getPlatformInfo } from './util';

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
        body: JSON.stringify({ report, platform: getPlatformInfo() }),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
};

export default lightFlare;
