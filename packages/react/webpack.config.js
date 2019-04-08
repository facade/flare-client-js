const path = require('path');

module.exports = {
    entry: './index.ts',

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'flare-react',
        libraryTarget: 'umd',
    },

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
