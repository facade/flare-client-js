import React from 'react';
import flareClient from 'flare-client';

interface ReactErrorInfo {
    componentStack: String;
}

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

interface Props {
    children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component {
    constructor(props: Props) {
        super(props);

        if (!flareClient) {
            console.error(
                `Flare React Plugin: the Flare Client could not be found.
                Errors in your React components will not be reported.`
            );
        }
    }

    componentDidCatch(error: Error, info: ReactErrorInfo) {
        if (flareClient) {
            const context: Context = {
                react: {
                    componentStack: formatReactComponentStack(info.componentStack),
                },
            };

            flareClient.reportError(error, context);
        }
    }

    render() {
        return this.props.children;
    }
}

// Regex taken from bugsnag: https://github.com/bugsnag/bugsnag-js/blob/c2020c6522fc075d284ad9441bbde8be155450d2/packages/plugin-react/src/index.js#L39
function formatReactComponentStack(stack: String) {
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}
