# Resolving bundled code

When you bundle your frontend code for production (using webpack, gulp, babel…), it won't look like the original code any longer and reported errors won't be very readable either. The solution for this is sourcemaps.

You can upload the sourcemaps that your bundler creates to Flare, and we'll make sure incoming reports show a clean stacktrace that resembles your original code.

## Laravel Mix / Webpack plugin

If you're using Laravel Mix or Webpack (versions 3 or 4), you can use our [Webpack plugin (link to npm)](https://www.npmjs.com/package/@flareapp/flare-webpack-plugin-sourcemap). If you're not using a different bundler, continue reading [here](#manually-uploading-your-sourcemaps).

To start the installation, run this in your project:

### Yarn

```
yarn add @flareapp/flare-webpack-plugin-sourcemap --dev
```

### NPM

```
npm install @flareapp/flare-webpack-plugin-sourcemap --dev
```

The only required parameter for the plugin is an object with the `key` key, which needs your Flare project's public key as its value.

The plugin also passes your project's API token to the JavaScript client by setting a global variable. This way, when initializing the Flare JS client, you can just run `flare.light()` without passing in your API key.

The plugin will not upload your sourcemaps to Flare when compiling in webpack's development or watch modes.

### Laravel Mix

`webpack.mix.js`

```JS
const FlareWebpackPluginSourcemap = require("@flareapp/flare-webpack-plugin-sourcemap");

mix.…
    .webpackConfig({
        plugins: [ new FlareWebpackPluginSourcemap({ key: "your-project-key" }) ],
    })
    .sourceMaps(true, 'hidden-source-map');
```

### Webpack

`webpack.config.js`

```JS
const FlareWebpackPluginSourcemap = require("@flareapp/flare-webpack-plugin-sourcemap");

module.exports = {
    …
    plugins: [ new FlareWebpackPluginSourcemap({ key: "your-project-key" }) ],

    devtool: "hidden-source-map"
    …
};
```

### Plugin options

You can pass some options to the plugin, in the same object as the key:

| Option             | Default | Description                                                                                                                                                                                                            |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`              | empty   | _(required)_ This is your project's public token. The plugin will automatically pass it to the Flare client through a global variable.                                                                                 |
| `runInDevelopment` | `false` | Setting this value to `true` will cause the plugin to upload your sourcemaps even when compiling in webpack's `dev` mode. This will still prevent the plugin from uploading sourcemaps when compiling in `watch` mode. |

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
