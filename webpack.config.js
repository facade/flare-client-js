const path = require('path');

module.exports = {
    entry: ['whatwg-fetch', '@babel/polyfill', './src/index.js'],

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },

    target: 'web',

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
