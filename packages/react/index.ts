interface ReactErrorInfo {
    componentStack: String;
}

interface FlareClient {
    reportError: Function;
    reportingUrl: string;
    key: string;
}

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

export default function ReactErrorBoundary(flareClient: FlareClient, React) {
    return class ErrorBoundary extends React.Component {
        componentDidCatch(error: Error, info: ReactErrorInfo) {
            const seenAt = new Date();

            const context: Context = {
                react: {
                    componentStack: formatReactComponentStack(info.componentStack),
                },
            };

            flareClient.reportError({ error, seenAt, context });

            throw error;
        }

        render() {
            return this.props.children;
        }
    };
}

// Regex taken from bugsnag: https://github.com/bugsnag/bugsnag-js/blob/c2020c6522fc075d284ad9441bbde8be155450d2/packages/plugin-react/src/index.js#L39
function formatReactComponentStack(stack: String) {
    return stack.split(/\s*\n\s*/g).filter(line => line.length > 0);
}
