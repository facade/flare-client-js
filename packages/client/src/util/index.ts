import build from '../build';

export function assert(value: any, message: string) {
    if (!value) {
        throw new Error(`Flare JavaScript client v${build.clientVersion}: ${message}`);
    }
}

// https://stackoverflow.com/a/11616993/6374824
export function flatJsonStringify(json: Object): string {
    let cache: any = [];

    const flattenedStringifiedJson = JSON.stringify(json, function(_, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                try {
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    return;
                }
            }
            cache.push(value);
        }
        return value;
    });

    cache = null;

    return flattenedStringifiedJson;
}

export function now(): number {
    return Math.round(Date.now() / 1000);
}

export function flattenOnce(array: Array<Array<any>>) {
    return array.reduce((flat, toFlatten) => {
        return flat.concat(toFlatten);
    }, []);
}
