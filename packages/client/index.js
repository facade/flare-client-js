import { reportError } from './reporter';

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

const catchWindowErrors = flareClient => {
    window.onerror = (message, source, lineno, colno, error) => {
        const seenAt = new Date();

        flareClient.reportError({ error, seenAt });
    };
};
