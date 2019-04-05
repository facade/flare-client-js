import { kebabToPascal, getCurrentEpochTime } from '../util';
import { reportError } from '../reporter';

export default function useVuePlugin(Vue) {
    if (!Vue || !Vue.config) {
        return;
    }

    const original = Vue.config.errorHandler;

    Vue.config.errorHandler = (error, vm, info) => {
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

        reportError({ error, seenAt, context });

        if (typeof original === 'function') {
            original(error, vm, info);
        }
    };
}
