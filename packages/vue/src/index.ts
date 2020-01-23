import Vue from 'Vue/types';
import { assert } from '@flareapp/flare-client/src/util';

interface Context {
    vue: {
        info: string;
        componentName: string;
    };
}

const flare = window.flare;

export function flareVue(Vue: Vue.VueConstructor) {
    assert(
        flare,
        'Flare Vue Plugin: the Flare Client could not be found. ' +
            'Errors in your Vue components will not be reported.'
    );

    assert(
        Vue && Vue.config,
        'Flare Vue Plugin: The Vue errorHandler could not be found. ' +
            'Errors in your Vue components will not be reported.'
    );

    const initialErrorHandler = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm: Vue, info: string) => {
        const componentName = vm && vm.$options && vm.$options.name ? vm.$options.name : 'AnonymousComponent';

        const context: Context = {
            vue: { info, componentName },
        };

        flare.report(error, context, { vue: { vm, info } });

        if (typeof initialErrorHandler === 'function') {
            initialErrorHandler(error, vm, info);

            return;
        }

        throw error;
    };
}
