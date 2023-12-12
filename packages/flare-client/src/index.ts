import FlareClient from './FlareClient';
import catchWindowErrors from './browserClient';
export { readLinesFromFile } from './stacktrace/fileReader';

export const flare = new FlareClient();

if (typeof window !== 'undefined' && window) {
    window.flare = flare;
}

catchWindowErrors();
