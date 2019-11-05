# Solution providers

Solutions can help you easily debug and fix common errors and mistakes. Solutions are created by solution providers, we encourage developers to create their own solution providers and to let us know about them.

## Registering a solution provider

```JS
import { flare } from '@flareapp/flare-client';
import aSolutionProvider from './solutionProvider';

flare.light('project-key');

flare.registerSolutionProvider(aSolutionProvider);
```

## Creating your own solution providers

Solution providers are objects that you register on the Flare client. They have to have at least these 2 properties:

-   `canSolve`, a function that receives the original error and returns a boolean or a promise that resolves to a boolean.
-   `getSolutions`, a function that receives the original error and returns an array of solutions or a promise that resolves to an array of solutions.

Solutions have to have the following format:

```JS
{
    class: "class",
    title: "title",
    description: "description",
    links: {
        "Possible solution": "https://stackoverflow.com",
        "Some documentation": "https://reactjs.org/docs/state-and-lifecycle.html",
    },
}
```

Here's a simple example of a solution provider. Keep in mind both the `canSolve` and `getSolutions` functions don't have to return promises, but are allowed to:

```JS
const mySolutionProvider = {
    canSolve(error) {
        return true;
    },

    getSolutions(error) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        class: 'class test',
                        title: 'title test',
                        description: 'description test',
                        links: { 'link test': 'https://google.com' },
                    },
                ]);
            }, 500);
        });
    },
};
```

## Extra solution parameters

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
