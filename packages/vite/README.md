# Vite plugin for sending sourcemaps to Flare

The Flare Vite plugin helps you send sourcemaps of your compiled JavaScript code to Flare. This way, reports sent using the `@flareapp/js` will be formatted correctly.

Additionally, it automatically passes the Flare API key to `@flareapp/js`. This way, `flare.light()` works without any additional configuration.

Check the JavaScript error tracking section in [the Flare documentation](https://flareapp.io/docs/javascript-error-tracking/installation) for more information.

## Installation

Install the plugin using NPM or Yarn:

```bash
yarn add @flareapp/vite
# or
npm install @flareapp/vite
```
Next, add the plugin to your `vite.config.js` file:

```js
import { defineConfig } from 'vite';
import flareSourcemapUploader from '@flareapp/vite';

export default defineConfig({
    plugins: [
        flareSourcemapUploader({
            key: 'YOUR API KEY HERE'
        }),
    ],
});
```

Run the `vite build` command to make sure the sourcemaps are generated. You should see the following lines in the output:

```bash
@flareapp/flare-vite-plugin-sourcemaps: Uploading 12 sourcemap files to Flare.
@flareapp/flare-vite-plugin-sourcemaps: Successfully uploaded sourcemaps to Flare.
```

## Configuration

- `key: string` **(required)**: the Flare API key 
- `base: string`: the base path of built output (defaults to Vite's base path)
- `runInDevelopment: boolean`: whether to upload sourcemaps when `NODE_ENV=development` or when running the dev server (defaults to `false`)
- `version: string`: the sourcemap version (defaults to a fresh `uuid` per build)
- `removeSourcemaps: boolean`: whether to remove the sourcemaps after uploading them (defaults to `false`). Comes in handy when you want to upload sourcemaps to Flare but don't want them published in your build.

## development

Publish a new release: 

```bash
npm version patch
npm publish
```

Tag the release:

<pre>
git tag <var>VERSION</var>
git push origin <var>VERSION</var>
</pre>

Replace <var>VERSION</var> with `v` + the version from `package.json` — for example, `v1.0.2` 
