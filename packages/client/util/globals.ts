declare const FLARE_GIT_INFO: Flare.Context['git'];
export const flareGitInfo = typeof FLARE_GIT_INFO === 'undefined' ? {} : FLARE_GIT_INFO;

declare const FLARE_JS_CLIENT_VERSION: string;
export const clientVersion = typeof FLARE_JS_CLIENT_VERSION === 'undefined' ? '?' : FLARE_JS_CLIENT_VERSION;

declare const FLARE_SOURCEMAP_VERSION: string;
export const flareSourcemapVersion = typeof FLARE_SOURCEMAP_VERSION === 'undefined' ? '' : FLARE_SOURCEMAP_VERSION;
