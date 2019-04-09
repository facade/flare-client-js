interface FlareClient {
    reportError: Function;
    reportingUrl: string;
    key: string;
}

export default function catchWindowErrors(flareClient: FlareClient) {
    window.onerror = (_1, _2, _3, _4, error) => {
        flareClient.reportError(error);
    };
}
