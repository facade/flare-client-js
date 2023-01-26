import Vue from 'Vue/types';
import { assert } from '@flareapp/flare-client/src/util';

interface Context {
    vue: {
        info: string;
        componentName: string;
    };
}

export function flareVue(Vue: Vue.VueConstructor) {
    const flare = typeof window !== 'undefined' ? window.flare : null;

    if (
        !assert(
            flare,
            'Flare Vue Plugin: the Flare Client could not be found. ' +
                'Errors in your Vue components will not be reported.',
            true
        ) ||
        !assert(
            Vue && Vue.config,
            'Flare Vue Plugin: The Vue errorHandler could not be found. ' +
                'Errors in your Vue components will not be reported.',
            flare ? flare.debug : false
        )
    ) {
        return;
    }

    const initialErrorHandler = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm: Vue, info: string) => {
        const componentName = vm && vm.$options && vm.$options.name ? vm.$options.name : 'AnonymousComponent';

        const context: Context = {
            vue: { info, componentName },
        };

        flare?.report(error, context, { vue: { vm, info } });

        if (typeof initialErrorHandler === 'function') {
            initialErrorHandler(error, vm, info);

            return;
        }

        throw error;
    };
}
