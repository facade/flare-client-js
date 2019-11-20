# Installation

To start catching JavaScript errors in your production environment, install the client in your project:

```
yarn add @flareapp/flare-client
```

and initialize it as early as possible in your application:

```JS
import { flare } from "@flareapp/flare-client";

// only launch in production, we don't want to waste your quota while you're developing.
if (process.env.NODE_ENV === 'production') {
    flare.light('your-project-key');
}
```

To verify that the Flare JavaScript Client was installed correctly and will report your frontend errors, run the `flare.test()` command in your browser console. This will generate and report an error that should be visible on your project's dashboard in [Flare](https://flareapp.io/projects).

The client will automatically catch errors that aren't caught and bubble up to the `window` object. This includes most errors in vanilla JS code that isn't wrapped in a `try…catch` block. Errors that are caught by, for example, Axios' `catch` block, will not be reported automatically. Keep on reading to find out how to send those errors to Flare too.

Creating a report for an error can take a second, and has a chance of slowing down your application (only during that second). If you want to stop some errors from being evaluated, use the `flare.beforeEvaluate(error)` function. If you return (a Promise returning) `false` from that function, Flare won't try to create an error report for that error.

You can also stop a report from being sent to Flare, or edit it just before its sent by using the `flare.beforeSent(report)` function. You can read more about this here: `<link to adding-custom-context#customizing-the-report-before-sending>`.

## Reporting caught errors

You can also report errors in `catch` statements or error boundaries by doing the following:

```JS
import { flare } from "@flareapp/flare-client";

try {
    functionThatMightThrow();
} catch (error) {
    flare.report(error);
}
```

## Important notes

-   Errors in a development environment might not always be reported, this is normal. If you want to be sure the Flare client is set up correctly, try it out in a production build on your machine.

-   Some frameworks like React and Vue have their own way of handling errors and require some extra steps to get running. You can easily hook into these by using one of the plugins we provide: `<link to framework-integrations page>`.

-   When you bundle your frontend code for production (using webpack, gulp, babel…), it won't look like the original code any longer and reported errors won't be very readable either. The solution for this is sourcemaps, read more about this on `<link to resolving-bundled-code>`.

-   If you want the client to work on older browsers (<=IE11), you have to provide a polyfill for the Promise library yourself. The client might not work on browsers older than IE9 at all.
