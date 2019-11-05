import React from 'react';
import { assert } from 'flare-client/src/util';

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

interface Props {
    children: React.ReactNode;
}

const flare = window.flare;

export class FlareErrorBoundary extends React.Component {
    constructor(props: Props) {
        super(props);

        assert(
            flare,
            `Flare React Plugin: the Flare Client could not be found.
            Errors in your React components will not be reported.`
        );
    }

    componentDidCatch(error: Error, reactErrorInfo: React.ErrorInfo) {
        reportReactError(error, reactErrorInfo);
    }

    render() {
        return this.props.children;
    }
}

function formatReactComponentStack(stack: String) {
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}

export function reportReactError(error: Error, reactErrorInfo: React.ErrorInfo) {
    if (flare) {
        const context: Context = {
            react: {
                componentStack: formatReactComponentStack(reactErrorInfo.componentStack),
            },
        };

        flare.report(error, context, { react: { errorInfo: reactErrorInfo } });
    }
}
