import useVuePlugin from './integrations/vue';
import ReactErrorBoundary from './integrations/react';
import catchWindowErrors from './integrations/window';
import { reporter } from './reporter';

export const flare = {};

export default function lightFlare({ reportingUrl = '', key = '', withVue, Vue = window.Vue, withReact, React = window.React, ReactFallbackUi = null }) {
    if (!reportingUrl) {
        console.error('Flare JS Client: no reportingUrl was passed, shutting down.');
        return false;
    }

    if (!key) {
        console.error('Flare JS Client: no Flare key was passed, shutting down.');
        return false;
    }

    function reportError({ error, seenAt, context = {} }) {
        reporter({ reportingUrl, key, error, seenAt, context });
    }

    catchWindowErrors(reportError);

    if (Vue || (withVue && Vue)) {
        useVuePlugin(reportError, Vue);
    }

    if (React || (withReact && React)) {
        return ReactErrorBoundary(reportError, React, ReactFallbackUi);
    }

    return true;
}
