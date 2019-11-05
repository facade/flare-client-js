export default function catchWindowErrors() {
    const flare = window.flare;

    if (!window || !flare) {
        return;
    }

    const originalOnerrorHandler = window.onerror;

    window.onerror = (_1, _2, _3, _4, error) => {
        if (error) {
            flare.report(error);
        }

        if (typeof originalOnerrorHandler === 'function') {
            originalOnerrorHandler(_1, _2, _3, _4, error);
        }
    };
}
