import StackTrace from 'stacktrace-js';

import { kebabToPascal, stringifyStackframes } from '../util';

const useVuePlugin = (reportError, Vue) => {
    if (!Vue || !Vue.config) {
        return;
    }

    Vue.config.errorHandler = (error, vm, info) => {
        /* This is needed to still output the error to the user's console,
            I'm not entirely sure why it's not being bubbled up after this function */
        console.error(error);

        // TODO: use stackframesFromError from util and remove StackTrace import in this file
        StackTrace.fromError(error).then(stackframes => {
            const computed = Object.keys(vm._computedWatchers).map(key => {
                return { [key]: vm._computedWatchers[key].value };
            });

            // TODO: get vuex store if exists
            // TODO: get Vue events from last x seconds?

            const formattedError = {
                message: error.message,
                originalError: stringifyStackframes(stackframes),
                stackframes,
                extraInfo: {
                    vue: {
                        info,
                        componentName: kebabToPascal(vm.$options._componentTag),
                        props: vm.$options.propsData,
                        data: vm._data,
                        computed,
                    },
                },
            };

            reportError(formattedError);
        });
    };
};

export default useVuePlugin;
