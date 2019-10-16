# Solution providers

Solutions can help you easily debug common errors. We encourage developers to create their own solution providers and to let us know about them.

Solution providers are objects that you register on the Flare client. They have to have at least these 2 properties:

-   `canSolve`, a function that receives the original error and returns `true` or `false`.
-   `getSolutions`, a function that the Flare client can call to get an array of solutions for the error. It also receives the original error object.

Solutions are formatted like this:

```JS
{
    class: "class",
    title: "title",
    description: "description",
    links: { "Possible solution": "https://stackoverflow.com" },
}
```

This is how you create and register a custom solution provider:

```JS
import flareClient from 'flare-client';

const mySolutionProvider = {
    canSolve(error) {
        return true;
    },

    getSolutions(error) {
        return [
            {
                class: "class test",
                title: "title test",
                description: "description test",
                links: { "link test": "https://google.com" },
            }
        ];
    }
};

flareClient.registerSolutionProvider(mySolutionProvider);
```

If you encounter a React or Vue error, the extra information that was collected by the React error boundary or Vue error handler is sent along as an extra parameter:

-   Vue: The `vm` object and `info` string from the `errorHandler` function: https://vuejs.org/v2/api/#errorHandler
-   React: The `errorInfo` object we get from `componentDidCatch`: https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries

```JS
{
    canSolve(error, extra) {
        // extra.vue
        // extra.react.errorInfo.componentStack
        // …
    },

    getSolutions(error, extra) {
        // …
    }
}
```
