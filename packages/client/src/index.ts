import FlareClient from './FlareClient';
import catchWindowErrors from './browserClient';

export const flare = new FlareClient();

if (window) {
    window.flare = flare;
}

catchWindowErrors();
