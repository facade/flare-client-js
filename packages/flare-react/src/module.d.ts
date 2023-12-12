type Flare = import('@flareapp/flare-client/dist/FlareClient').default;

interface Window {
    flare: Flare;
}

declare module '@flareapp/flare-client' {
    export const FlareClient: string;
}
