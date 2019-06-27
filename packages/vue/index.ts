import flareClient from 'flare-client';

interface Context {
    vue: {
        info: String;
        componentName: String;
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
    };
}

export default function install(Vue: Vue) {
    if (!flareClient) {
        console.error(
            `Flare Vue Plugin: the Flare Client could not be found.
            Errors in your Vue components will not be reported.`
        );
    }

    if (!Vue || !Vue.config) {
        console.error(
            `Flare Vue Plugin: The Vue errorHandler could not be found.
            Errors in your Vue components will not be reported.`
        );
    }

    const original = Vue.config.errorHandler;

    Vue.config.errorHandler = (error: Error, vm: Vm, info: String) => {
        let componentName;

        if (vm && vm.$options && vm.$options._componentTag) {
            componentName = kebabToPascal(vm.$options._componentTag);
        }

        const context: Context = {
            vue: {
                info,
                componentName: componentName || 'Anonymous Component',
            },
        };

        flareClient.reportError(error, context);

        if (typeof original === 'function') {
            original(error, vm, info);
            return;
        }

        throw error;
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
