import { reportError } from './reporter';

interface FlareClient {
    reportError: Function;
    reportingUrl: string;
    key: string;
}

export const flareClient = {
    reportError,
    reportingUrl: '',
    key: '',
};

export default function lightFlare({ reportingUrl = '', key = '' }) {
    if (!reportingUrl) {
        console.error('Flare JS Client: no reportingUrl was passed, shutting down.');
        return false;
    }

    if (!key) {
        console.error('Flare JS Client: no Flare key was passed, shutting down.');
        return false;
    }

    flareClient.reportingUrl = reportingUrl;
    flareClient.key = key;

    catchWindowErrors(flareClient);

    return flareClient;
}

const catchWindowErrors = (flareClient: FlareClient) => {
    window.onerror = (_1, _2, _3, _4, error) => {
        flareClient.reportError({ error });
    };
};
