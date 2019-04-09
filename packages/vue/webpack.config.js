const merge = require('../../node_modules/webpack-merge');
const path = require('path');

const baseConfig = require('../../webpack.config');

module.exports = merge(baseConfig, {
    output: {
        library: 'flare-vue',
        path: path.resolve(__dirname, 'dist'),
    },
});
