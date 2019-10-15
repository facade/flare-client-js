import ErrorStackParser from 'error-stack-parser';
import { getCodeSnippet } from './fileReader';

export function createStackTrace(error: Error): Promise<Array<Flare.StackFrame>> {
    return new Promise((resolve, reject) => {
        if (!hasStack(error)) {
            return reject(undefined);
        }

        Promise.all(
            ErrorStackParser.parse(error).map(frame => {
                return new Promise<Flare.StackFrame>(resolve => {
                    getCodeSnippet(frame.fileName, frame.lineNumber, frame.columnNumber).then(snippet => {
                        resolve({
                            line_number: frame.lineNumber || 1,
                            column_number: frame.columnNumber || 1,
                            method: frame.functionName || 'Anonymous or unknown function',
                            file: frame.fileName || 'Unknown file',
                            code_snippet: snippet.codeSnippet,
                            trimmed_column_number: snippet.trimmedColumnNumber,
                            class: '',
                        });
                    });
                });
            })
        ).then(resolve);
    });
}

function hasStack(err: any): boolean {
    return (
        !!err &&
        (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
        typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
        err.stack !== `${err.name}: ${err.message}`
    );
}
