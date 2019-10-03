const cachedFiles: { [key: string]: string } = {};

type CodeSnippet = {
    [key: number]: string;
};

export function getCodeSnippet(url?: string, lineNumber?: number, columnNumber?: number): Promise<CodeSnippet> {
    return new Promise(resolve => {
        if (!url || !lineNumber) {
            resolve({ 0: 'Could not read from file' });
            return;
        }

        readFile(url).then(fileText => {
            if (!fileText) {
                resolve({ 0: 'Could not read from file' });
                return;
            }

            resolve(readLinesFromFile(fileText, lineNumber, columnNumber));
        });
    });
}

function readFile(url: string): Promise<string | null> {
    return new Promise(resolve => {
        const rawFile = new XMLHttpRequest();

        if (cachedFiles[url]) {
            resolve(cachedFiles[url]);
            return;
        }

        rawFile.open('GET', url, false);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    cachedFiles[url] = rawFile.responseText;

                    resolve(rawFile.responseText);
                    return;
                }
            }

            resolve(null);
            return;
        };

        rawFile.send(null);
    });
}

function readLinesFromFile(fileText: string, lineNumber: number, columnNumber?: number): CodeSnippet {
    const codeSnippet: CodeSnippet = {};

    const lines = fileText.split('\n');

    for (let i = -10; i <= 10; i++) {
        const currentLineIndex = lineNumber + i;

        if (currentLineIndex >= 0 && lines[currentLineIndex]) {
            const displayLine = currentLineIndex + 1; // the linenumber in a stacktrace is not zero-based like an array

            if (lines[currentLineIndex].length > 1000) {
                if (columnNumber) {
                    codeSnippet[displayLine] = '…' + lines[currentLineIndex].substr(columnNumber - 500, 1000) + '…';

                    continue;
                }

                codeSnippet[displayLine] = lines[currentLineIndex].substr(0, 1000) + '…';

                continue;
            }

            codeSnippet[displayLine] = lines[currentLineIndex];
        }
    }

    return codeSnippet;
}
