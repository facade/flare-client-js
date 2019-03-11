import StackTrace from 'stacktrace-js';

const useVuePlugin = (reportError, Vue) => {
    if (!Vue || !Vue.config) {
        return;
    }

    Vue.config.errorHandler = (error, vm, info) => {
        StackTrace.fromError(error).then(stacktrace => {
            // kebab to camel https://stackoverflow.com/a/6661012/6374824
            const componentName = vm.$options._componentTag.replace(/-([a-z])/g, function(g) {
                return g[1].toUpperCase();
            });

            const props = vm.$options.propsData;
            const data = vm._data;

            const computed = Object.keys(vm._computedWatchers).map(key => {
                return { [key]: vm._computedWatchers[key].value };
            });

            // TODO: get vuex store if exists
            // TODO: get Vue events from last x seconds?

            const formattedError = {
                message: error.message,
                originalError: error,
                stacktrace,
                extraInfo: {
                    vue: {
                        componentName,
                        info,
                        props,
                        data,
                        computed,
                    },
                },
            };

            reportError(formattedError);
        });
    };
};

export default useVuePlugin;
