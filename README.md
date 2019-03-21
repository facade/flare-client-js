The JavaScript client for Flare to catch your frontend errors.

Comes with Vue (and soon React) integrations.

To start developing:
- Run `npm link` in this repository's root directory

- Run `npm link pocflare` in the project where you want to log frontend errors

As early as possible in the application you want to log:

```js
import igniteFlare from 'flare-client-js/src';

const flareOptions = {
    serverUrl: 'public server url',
    withVue: true, // optional
    Vue, // optional
};

igniteFlare(flareOptions);
```
