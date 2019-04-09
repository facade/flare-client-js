import React from 'react';

interface ReactErrorInfo {
    componentStack: String;
}

interface Context {
    react: {
        componentStack: Array<String>;
    };
}

export default function ReactErrorBoundary() {
    return class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);

            if (!this.props.client) {
                console.error('Flare React Plugin: no `client` prop received, we will not report errors in your React components.');
            }
        }

        componentDidCatch(error: Error, info: ReactErrorInfo) {
            if (this.props.client) {
                const context: Context = {
                    react: {
                        componentStack: formatReactComponentStack(info.componentStack),
                    },
                };

                this.props.client.reportError({ error, context });
            }

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
