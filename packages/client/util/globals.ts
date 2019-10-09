declare const FLARE_GIT_INFO: Flare.Context['git'];

declare const FLARE_JS_CLIENT_VERSION: string;

declare const FLARE_SOURCEMAP_VERSION: string;

export const flareGitInfo = typeof FLARE_GIT_INFO === 'undefined' ? {} : FLARE_GIT_INFO;
export const clientVersion = typeof FLARE_JS_CLIENT_VERSION === 'undefined' ? '?' : FLARE_JS_CLIENT_VERSION;
export const flareSourcemapVersion = typeof FLARE_SOURCEMAP_VERSION === 'undefined' ? '' : FLARE_SOURCEMAP_VERSION;
