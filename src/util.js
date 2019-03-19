import StackTrace from 'stacktrace-js';
import platform from 'platform';

//https://stackoverflow.com/a/44082344/6374824
export function kebabToPascal(str) {
    str += '';
    str = str.split('-');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length);
    }
    return str.join('');
}

export function stringifyStackframes(stackframes) {
    return stackframes
        .map(sf => {
            return sf.toString();
        })
        .join('\n');
}

export function stackframesFromError(error) {
    return new Promise(resolve => {
        StackTrace.fromError(error).then(stackframes => resolve(stackframes));
    });
}

export function getPlatformInfo() {
    return platform;
}
