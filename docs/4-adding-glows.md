# Adding glows

In addition to custom context items, you can also add "Glows" to your application. Glows allow you to add little pieces of information, that can later be found in a chronological order in the "Debug" tab of your application.

You can think of glows as breadcrumbs that can help you track down which parts of your code an exception went through.

You can add glows to your reports like this:

```JS
flareClient.glow("This is a message from glow!", "info", ["argument one", "argument two"]);
```
