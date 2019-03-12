const path = require('path');

module.exports = {
    entry: ['whatwg-fetch', './src/index.js'],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'web',
};
