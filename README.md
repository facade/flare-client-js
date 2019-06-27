The JavaScript client for Flare to catch your frontend errors.

Comes with Vue and React integrations.

# Flare Client

### Important notes
 - None of the integrations will work before running this setup. Make sure to import the `flare-client` before importing the integrations.

### Setup

```js
import flareClient from 'flare-client';

flareClient.light('your-api-key', 'http://flare.laravel.com.test/api/reports');

/* TODO: remove the reporting URL in the production client.
Maybe let it default to https://flare.laravel.com/api/reports,
but allow us to overwrite it for testing purposes? */
```

# Window

### Setup

```js
import registerFlareWindow from 'flare-window';

registerFlareWindow();
```

# Vue

### Setup

```js
import flareClient from 'flare-client';
import flareVlue from 'flare-vue';

flareClient.light('flare-api-token', 'http://flare.laravel.com/api/report');

Vue.use(flareVue);
```

# React

### Important notes

- While in development mode, React will throw errors up to the window, possibly causing errors to be caught twice. Make sure to only initialize the Flare JavaScript error reporter in production builds. Read this issue for more information: https://github.com/facebook/react/issues/10474

- Due to limitations in the architecture of React error boundaries, the Flare React error reporter may not handle all possible React errors. Read This page for more information: https://reactjs.org/docs/error-boundaries.html


### Setup

In your app's root (usually `app.js`), wrap your entire application in the provided `FlareErrorBoundary` component:

```js
import FlareErrorBoundary from 'flare-react';

render(
    <FlareErrorBoundary>
        <Root />
    </FlareErrorBoundary>,
    document.getElementById('app')
)
```
