import React from 'react';
import flareClient from 'flare-client';

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

    componentDidCatch(error: Error, reactErrorInfo: React.ErrorInfo) {
        reportReactError(error, reactErrorInfo);
    }

    render() {
        return this.props.children;
    }
}

function formatReactComponentStack(stack: String) {
    console.log(stack);
    console.log(stack.split(/\s*\n\s*/g).filter(line => line.length > 0));
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}

export function reportReactError(error: Error, reactErrorInfo: React.ErrorInfo) {
    if (flareClient) {
        const context: Context = {
            react: {
                componentStack: formatReactComponentStack(reactErrorInfo.componentStack),
            },
        };

        flareClient.reportError(error, context);
    }
}
