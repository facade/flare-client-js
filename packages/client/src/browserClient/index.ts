import FlareClient from '../index';

export default function catchWindowErrors() {
    if (!window) {
        return;
    }

    const originalOnerrorHandler = window.onerror;

    window.onerror = (_1, _2, _3, _4, error) => {
        if (error) {
            FlareClient.report(error);
        }

        if (typeof originalOnerrorHandler === 'function') {
            originalOnerrorHandler(_1, _2, _3, _4, error);
        }
    };
}
