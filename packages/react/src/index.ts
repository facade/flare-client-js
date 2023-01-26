import { ReactNode, Component } from 'react';
import { assert } from '@flareapp/flare-client/src/util';

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

interface Props {
    children: ReactNode;
}

export class FlareErrorBoundary extends Component {
    flare = typeof window !== 'undefined' ? window.flare : null;

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

export function reportReactError(error: Error, reactErrorInfo: React.ErrorInfo, flare: Flare | null) {
    if (flare) {
        const context: Context = {
            react: {
                componentStack: formatReactComponentStack(reactErrorInfo.componentStack),
            },
        };

        flare.report(error, context, { react: { errorInfo: reactErrorInfo } });
    }
}
