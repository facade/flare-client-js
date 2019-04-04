import { getCurrentEpochTime } from '../util';
import { reportError } from '../reporter';

const catchWindowErrors = () => {
    window.onerror = (message, source, lineno, colno, error) => {
        const seenAt = getCurrentEpochTime();

        reportError({error, seenAt });
    };
};

export default catchWindowErrors;
