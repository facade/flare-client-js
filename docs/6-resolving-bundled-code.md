# Resolving bundled code

When you bundle your frontend code for production (using webpack, gulp, babel…), it won't look like the original code any longer and reported errors won't be very readable either. The solution for this is sourcemaps.

You can upload the sourcemaps that your bundler creates to Flare, and we'll make sure incoming reports show a clean stacktrace that resembles your original code.

## Laravel Mix / Webpack plugin

If you're using Laravel Mix or Webpack, you can use our Webpack plugin: `<link to webpack plugin on npm>`.

To start the installation, run this in your project:

```
yarn add flare-webpack-plugin-sourcemap --dev
```

Then, add the plugin to your webpack configuration and make sure your app is creating a sourcemap by including the `devtool: "source-map"` line.

### Laravel Mix

`webpack.mix.js`

```JS
mix.…
    .webpackConfig({
        plugins: [ new FlareWebpackPluginSourcemap({ key: "your-project-key" }) ],

        devtool: "source-map"
    });
```

### Webpack

`webpack.config.js`

```JS
module.exports = {
    …
    plugins: [ new FlareWebpackPluginSourcemap({ key: "your-project-key" }) ],

    devtool: "source-map"
    …
};
```

## Manually uploading your sourcemaps

We don't have any UI in the Flare dashboard for uploading your sourcemaps. You can, however, upload it manually or with a script that runs after you've bundled your assets.

Send a POST request to http://flareapp.io/api/sourcemaps with this JSON payload (continue reading for more details on the parameters):

```JSON
{
    "key": "your-project-key",
    "version_id": "versionId",
    "relative_filename": "/js/app.js",
    "sourcemap": "base64 string of gzipped sourcemap (this sounds more complicated than it is)",
}
```

### key

The API key of your project in Flare.

### version_id

This has to be a project-unique string that is also included in your bundled code as a global environment variable `FLARE_SOURCEMAP_VERSION`. Alternatively, you can set the `sourcemapVersion` property of the Flare client instance.

In the webpack plugin, we use the uuid4 spec to generate a unique string for each build.

### relative_filename

The [relative path](<https://en.wikipedia.org/wiki/Path_(computing)#Absolute_and_relative_paths>) to the file this sourcemap belongs to, starting from the root of your domain.

### sourcemap

A base64 string of your gzipped sourcemap. Here's how you could generate it using the built-in [Zlib](https://nodejs.org/api/zlib.html) library for Node.js, but the commandline `gzip` tool should work just as well:

```JS
const zlib = require('zlib');

const base64GzipSourcemap = zlib.deflateRawSync(sourcemap.content).toString('base64');
```
