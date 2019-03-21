import { stringifyStackframes, stackframesFromError } from '../util';

const catchWindowErrors = reportError => {
    window.onerror = (message, source, lineno, colno, error) => {
        stackframesFromError(error).then(stackframes => {
            const formattedError = {
                message: error.message,
                originalError: stringifyStackframes(stackframes),
                stackframes,
            };

            reportError(formattedError);
        });
    };
};

export default catchWindowErrors;
