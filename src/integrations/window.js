import { getCurrentEpochTime } from '../util';

const catchWindowErrors = reportError => {
    window.onerror = (message, source, lineno, colno, error) => {
        const seenAt = getCurrentEpochTime();

        reportError({error, seenAt });
    };
};

export default catchWindowErrors;
