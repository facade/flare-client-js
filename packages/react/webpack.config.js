const path = require('path');
const { merge } = require('../../node_modules/webpack-merge');

const baseConfig = require('../../webpack.config');

module.exports = merge(baseConfig, {
    output: {
        path: path.resolve(__dirname, 'dist'),
    },

    externals: {
        react: 'react',
        '@flareapp/flare-client': '@flareapp/flare-client',
    },
});
