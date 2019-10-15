declare const FLARE_JS_CLIENT_VERSION: string | undefined;
declare const FLARE_SOURCEMAP_VERSION: string | undefined;
declare const FLARE_GIT_INFO: object | undefined;

export default {
    clientVersion: typeof FLARE_JS_CLIENT_VERSION === 'undefined' ? '?' : FLARE_JS_CLIENT_VERSION,
    sourcemapVersion: typeof FLARE_SOURCEMAP_VERSION === 'undefined' ? '' : FLARE_SOURCEMAP_VERSION,
    gitInfo: typeof FLARE_GIT_INFO === 'undefined' ? {} : FLARE_GIT_INFO,
};
