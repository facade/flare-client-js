const catchWindowErrors = flareClient => {
    window.onerror = (message, source, lineno, colno, error) => {
        const seenAt = new Date();

        flareClient.reportError({ error, seenAt });
    };
};

export default catchWindowErrors;
