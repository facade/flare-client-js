import StackTrace from 'stacktrace-js';

const catchWindowErrors = reportError => {
    window.onerror = (message, source, lineno, colno, error) => {
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
