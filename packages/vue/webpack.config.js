const path = require('path');

module.exports = {
    entry: './index.js',

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'flare-vue',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
