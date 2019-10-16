# Framework integrations

If a framework you use is not yet supported, feel free to let us know, or write a custom integration for it yourself (we'll retweet you).

## React

React's error handling works similarly to how it works in vanilla JavaScript. You can wrap parts of your component tree in error boundary components, which can stop the error from bubbling further up the tree and crashing your entire application.

In your app's root file (`/src/App.js` for `creact-react-app`), wrap your entire component tree in the provided FlareErrorBoundary component:

```JSX
import FlareErrorBoundary from 'flare-react';

render(
    <FlareErrorBoundary>
        <Root />
    </FlareErrorBoundary>,
    document.getElementById('app')
)
```

_Note: If you bundle React for development, you will see that many errors are reported twice. This is expected behaviour and will not occur in a production bundle (read more: https://github.com/facebook/react/issues/10474)._

You should use a combination of Flare's and your own error boundaries, continue reading to find out how to report errors to Flare in your own error boundary components.

## Reporting React errors in your own error boundaries

If you have your own error boundary components, e.g. for displaying a fallback component when something goes wrong, the error won't bubble up to Flare's error boundary and the error won't be reported to the Flare app automatically.

If you still want to know about these errors, you can do this pretty easily:

```JSX
import { reportReactError } from "flare-react";

export default class ErrorBoundary extends React.Component {
    componentDidCatch(error, info) {
        reportReactError(error, info);
    }
}
```

## Vue

Vue uses a global error handler that we can easily plug into. Simply register the extension as a Vue plugin, in the same place where you created your Vue instance:

```JS
import flareVue from "flare-vue";
import Vue from 'vue';

Vue.use(flareVue);

const app = new Vue({ el: "#app" });
```
