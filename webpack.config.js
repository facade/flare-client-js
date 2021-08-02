module.exports = {
    entry: './src/index.ts',

    experiments: {
        outputModule: true,
    },
    output: {
        filename: 'index.js',
        library: {
            type: 'module',
        },
        environment: { module: true },
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
