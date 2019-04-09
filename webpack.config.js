const webpack = require('webpack');

module.exports = {
    entry: './index.ts',

    output: {
        filename: 'index.js',
        libraryTarget: 'umd',
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./package.json').version),
        }),
    ],

    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                    },
                },
            },
        ],
    },
};
