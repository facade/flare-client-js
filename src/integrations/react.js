import { getCurrentEpochTime, formatReactComponentStack } from '../util';
import { reportError } from '../reporter';

export default function ReactErrorBoundary(React, FallbackUi) {
    return class ErrorBoundary extends React.Component {
        constructor() {
            super();

            this.state = { hasError: false };
        }

        componentDidCatch(error, info) {
            const seenAt = getCurrentEpochTime();

            const context = {
                react: {
                    componentStack: formatReactComponentStack(info.componentStack),
                },
            };

            reportError({ error, seenAt, context });

            this.setState({ hasError: true });
        }

        render() {
            if (this.state.hasError && FallbackUi) {
                return FallbackUi;
            }

            return this.props.children;
        }
    };
}
