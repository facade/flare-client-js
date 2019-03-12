import StackTrace from 'stacktrace-js';

import { kebabToPascal, stringifyStackframes } from '../util';

const useVuePlugin = (reportError, Vue) => {
    if (!Vue || !Vue.config) {
        return;
    }

    Vue.config.errorHandler = (error, vm, info) => {
        console.error(error);

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
