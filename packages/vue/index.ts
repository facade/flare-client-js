import flareClient from 'flare-client';

interface Context {
    vue: {
        info: String;
        componentName: String;
        props: Object;
        data: Object;
        computed?: Array<Object>;
    };
}

export default function install(Vue) {
    const original = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm, info: String) => {
        let computed = undefined;
        if (vm._computedWatchers) {
            computed = Object.keys(vm._computedWatchers).map(key => {
                return { [key]: vm._computedWatchers[key].value };
            });
        }

        const context: Context = {
            vue: {
                info,
                componentName: kebabToPascal(vm.$options._componentTag),
                props: vm.$options.propsData,
                data: vm._data,
                computed,
            },
        };

        flareClient.reportError(error, context);

        if (typeof original === 'function') {
            original(error, vm, info);
        }
    };
}

//https://stackoverflow.com/a/44082344/6374824
function kebabToPascal(str: String) {
    str += '';
    const splitStr = str.split('-');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].slice(0, 1).toUpperCase() + splitStr[i].slice(1, splitStr[i].length);
    }
    return splitStr.join('');
}
