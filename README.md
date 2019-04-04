The JavaScript client for Flare to catch your frontend errors.

Comes with Vue (and soon React) integrations.

To start developing:
- Run `npm link` in this repository's root directory

- Run `npm link pocflare` in the project where you want to log frontend errors

As early as possible in the application you want to log:

```js
import igniteFlare from 'flare-client-js/src';

const flareOptions = {
    reportingUrl: 'public server url',
    withVue: true, // optional
    Vue, // optional
    withReact: true, // optional
    React, // optional
};

igniteFlare(flareOptions);
```

# React example

In the root component, outside of the class definition:
```js
import React from "react";
import igniteFlare from "flare-client-js/src";

const FlareErrorBoundary = igniteFlare({
    reportingUrl: "https://b09ae4f2.ngrok.io",
    React,
    ReactFallbackUi: <div>Error occurred :(</div>,
});
```

In the render template:
```js
<FlareErrorBoundary>
    <Component {...props} />
</FlareErrorBoundary>,
```
