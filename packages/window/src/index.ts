import flare from 'flare-client';

export default function catchWindowErrors() {
    window.onerror = (_1, _2, _3, _4, error) => {
        if (error) {
            flare.report(error);
        }
    };
}
