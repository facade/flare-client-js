The JavaScript client for Flare to catch your frontend errors.

Comes with Vue and React integrations.

# Flare Client

### Important notes
 - None of the integrations will work before running the setup of the client. Make sure to import the `flare-client` before importing any integrations.

 - The client will only automatically report **uncaught** errors. Error boundaries (like `try…catch` or React error boundaries) will need to implement a custom method of reporting errors to the platform, as described elsewhere in the docs.

### Setup

```js
import flareClient from 'flare-client';

flareClient.light('your-api-key', 'http://flareapp.iotest/api/reports');

/* TODO: remove the reporting URL in the production client.
Maybe let it default to https://flareapp.io/api/reports,
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

flareClient.light('flare-api-token', 'http://flareapp.io/api/report');

Vue.use(flareVue);
```

# React

### Important notes

- While in development mode, React will throw errors up to the window, possibly causing errors to be caught twice. Make sure to only initialize the Flare JavaScript error reporter in production builds. Read this issue for more information: https://github.com/facebook/react/issues/10474

- Due to limitations in the architecture of React error boundaries, the Flare React error reporter will only report errors that occur while rendering. This means that errors that occur in event handlers will not be reported (eg an `onClick` function). To report these errors, you could also include the window error tracking Flare plugin. Read this page for more information: https://reactjs.org/docs/error-boundaries.html

Note to self: read through https://github.com/facebook/react/issues/11409 to figure out why event listeners are not caught by errorboundaries. Maybe there is a way to get this working after all, without also having to use the window client.


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
