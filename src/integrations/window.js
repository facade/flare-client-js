import StackTrace from 'stacktrace-js';

const catchWindowErrors = reportError => {
    window.onerror = (message, source, lineno, colno, error) => {
        // TODO: use stackframesFromError from util and remove StackTrace import in this file
        StackTrace.fromError(error).then(stacktrace => {

            const formattedError = {
                message: error.message,
                originalError: error,
                stacktrace,
            };

            reportError(formattedError);
        });
    };
};

export default catchWindowErrors;
