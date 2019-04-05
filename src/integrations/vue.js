export default function useVuePlugin(flareClient, Vue) {
    if (!Vue || !Vue.config) {
        return;
    }

    const original = Vue.config.errorHandler;

    Vue.config.errorHandler = (error, vm, info) => {
        const seenAt = new Date();

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

        flareClient.reportError({ error, seenAt, context });

        if (typeof original === 'function') {
            original(error, vm, info);
        }
    };
}

//https://stackoverflow.com/a/44082344/6374824
function kebabToPascal(str) {
    str += '';
    str = str.split('-');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length);
    }
    return str.join('');
}
