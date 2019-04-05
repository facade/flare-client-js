The JavaScript client for Flare to catch your frontend errors.

Comes with Vue (and soon React) integrations.

To start developing:
- Run `npm link` in this repository's root directory

- Run `npm link pocflare` in the project where you want to log frontend errors

As early as possible in the application you want to log:

```js
import igniteFlare from 'flare-client-js/src';

igniteFlare({
    key: 'key',
    reportingUrl: 'https://flare.com/report',
});
```

# React example

In the root component, outside of the class definition:
```js
import React from "react";
import igniteFlare, { flareClient } from "flare-client-js/src";
import FlareReact from "flare-client-js/src/integrations/react";

igniteFlare({
    key: 'key',
    reportingUrl: 'https://flare.com/report',
});

const FlareErrorBoundary = FlareReact(flareClient, React, <div>Error occurred :(</div>);
```

In the render template:
```js
<FlareErrorBoundary>
    <Component {...props} />
</FlareErrorBoundary>,
```
