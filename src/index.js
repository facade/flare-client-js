import catchWindowErrors from './integrations/window';

export const flareClient = {
    reportingUrl: '',
    key: '',
};

export default function lightFlare({
    reportingUrl = '',
    key = '',
}) {
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

    catchWindowErrors();

    return flareClient;
}
