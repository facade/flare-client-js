import { getCurrentEpochTime, formatReactComponentStack } from '../util';

export default function ReactErrorBoundary(reportError, React, FallbackUi) {
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
