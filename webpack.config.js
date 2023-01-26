module.exports = {
    entry: './src/index.ts',

    output: {
        filename: 'index.js',
        globalObject: 'globalThis',
        library: {
            type: 'umd',
        },
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
};
