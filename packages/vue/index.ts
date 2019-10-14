import flareClient from 'flare-client';
import Vue from 'Vue/types/index';

interface Context {
    vue: {
        info: string;
        componentName: string;
    };
}

export default function install(Vue: Vue.VueConstructor) {
    if (!flareClient) {
        console.error(
            'Flare Vue Plugin: the Flare Client could not be found. ' +
                'Errors in your Vue components will not be reported.'
        );
    }

    if (!Vue || !Vue.config) {
        console.error(
            'Flare Vue Plugin: The Vue errorHandler could not be found. ' +
                'Errors in your Vue components will not be reported.'
        );
    }

    const initialErrorHandler = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm: Vue, info: string) => {
        let componentName;

        if (vm && vm.$options && vm.$options.name) {
            componentName = vm.$options.name;
        }

        const context: Context = {
            vue: {
                info,
                componentName: componentName || 'Anonymous Component',
            },
        };

        flareClient.reportError(error, context, { vue: { vm, info } });

        if (typeof initialErrorHandler === 'function') {
            initialErrorHandler(error, vm, info);

            return;
        }

        throw error;
    };
}
