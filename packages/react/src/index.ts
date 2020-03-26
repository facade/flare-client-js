import React from 'react';
import { assert } from '@flareapp/flare-client/src/util';

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

interface Props {
    children: React.ReactNode;
}

export class FlareErrorBoundary extends React.Component {
    flare = window.flare;

    constructor(props: Props) {
        super(props);

        assert(
            this.flare,
            `Flare React Plugin: the Flare Client could not be found.
            Errors in your React components will not be reported.`,
            this.flare ? this.flare.debug : false
        );
    }

    componentDidCatch(error: Error, reactErrorInfo: React.ErrorInfo) {
        reportReactError(error, reactErrorInfo, this.flare);
    }

    render() {
        return this.props.children;
    }
}

function formatReactComponentStack(stack: String) {
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}

export function reportReactError(error: Error, reactErrorInfo: React.ErrorInfo, flare: Flare) {
    if (flare) {
        const context: Context = {
            react: {
                componentStack: formatReactComponentStack(reactErrorInfo.componentStack),
            },
        };

        flare.report(error, context, { react: { errorInfo: reactErrorInfo } });
    }
}
