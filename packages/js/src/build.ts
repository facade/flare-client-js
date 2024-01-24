declare const FLARE_JS_KEY: string | undefined;
declare const FLARE_SOURCEMAP_VERSION: string | undefined;

export default {
    // Injected during build
    clientVersion:
        typeof process.env.FLARE_JS_CLIENT_VERSION === 'undefined'
            ? '?'
            : process.env.FLARE_JS_CLIENT_VERSION,
    // Optionally injected by flare-vite-plugin-sourcemap-uploader
    flareJsKey: typeof FLARE_JS_KEY === 'undefined' ? '' : FLARE_JS_KEY,
    sourcemapVersion:
        typeof FLARE_SOURCEMAP_VERSION === 'undefined'
            ? ''
            : FLARE_SOURCEMAP_VERSION,
};
