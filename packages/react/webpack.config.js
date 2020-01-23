const merge = require('../../node_modules/webpack-merge');
const path = require('path');

const baseConfig = require('../../webpack.config');

module.exports = merge(baseConfig, {
    output: {
        library: '@flareapp/flare-react',
        path: path.resolve(__dirname, 'dist'),
    },

    externals: {
        react: 'react',
        '@flareapp/flare-client': '@flareapp/flare-client',
    },
});
