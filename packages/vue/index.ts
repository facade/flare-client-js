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

interface Vue {
    config: {
        errorHandler: Function;
    };
}

interface Vm {
    $options: {
        _componentTag?: string;
        propsData?: Object;
    };
    _computedWatchers?: any;
    _data?: Object;
}

export default function install(Vue: Vue) {
    const original = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm: Vm, info: String) => {
        // TODO: figure out a way to get the original Vue error (or don't run this while developing)
        console.error(error);

        let computed, componentName, props, data;

        if (vm) {
            if (vm._computedWatchers) {
                computed = Object.keys(vm._computedWatchers).map(key => {
                    return { [key]: vm._computedWatchers![key].value };
                });
            }

            if (vm._data) {
                data = vm._data;
            }

            if (vm.$options) {
                if (vm.$options._componentTag) {
                    componentName = kebabToPascal(vm.$options._componentTag);
                }

                if (vm.$options.propsData) {
                    props = vm.$options.propsData;
                }
            }
        }

        const context: Context = {
            vue: {
                info,
                componentName: componentName || 'Anonymous Component',
                props: props || {},
                data: data || {},
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
