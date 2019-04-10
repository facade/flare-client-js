The JavaScript client for Flare to catch your frontend errors.

Comes with Vue and React integrations.

# Vue example

```js
import flareClient from 'flare-client';
import flareVlue from 'flare-vue';

flareClient.light('flare-api-token', 'http://flare.laravel.com/api/report');

Vue.use(flareVlue);
```

# React example

In the root component, outside of the class definition:

```js
import flareClient from 'flare-client';
import FlareErrorBoundary from 'flare-react';

flareClient.light('flare-api-token', 'http://flare.laravel.com/api/report');
```

In the render template:

```js
<FlareErrorBoundary>
    <Component {...props} />
</FlareErrorBoundary>
```
