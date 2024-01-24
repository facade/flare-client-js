export default function request() {
    return {
        request: {
            url: window.document.location.href,
            useragent: window.navigator.userAgent,
            referrer: window.document.referrer,
            readyState: window.document.readyState,
        },
    };
}
