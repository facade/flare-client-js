import { kebabToPascal, getCurrentEpochTime } from '../util';
import { reportError } from '../reporter';

export default function useVuePlugin(Vue) {
    if (!Vue || !Vue.config) {
        return;
    }

    Vue.config.errorHandler = (error, vm, info) => {
        /* This is needed to still output the error to the user's console,
        I'm not entirely sure why it's not being bubbled up after this function */
        console.error(error); // TODO: figure out how to get the original Vue error and log that

        const seenAt = getCurrentEpochTime();

        let computed = undefined;
        if (vm._computedWatchers) {
            computed = Object.keys(vm._computedWatchers).map(key => {
                return { [key]: vm._computedWatchers[key].value };
            });
        }

        const context = {
            vue: {
                info,
                componentName: kebabToPascal(vm.$options._componentTag),
                props: vm.$options.propsData,
                data: vm._data,
                computed,
            },
        };

        // TODO: get vuex store if exists
        // TODO: get Vue events from last x seconds?

        reportError({ error, seenAt, context });
    };
}
