# How-to on adding new plugins

Within the plugin-folder, there is a list of directories for each plugin.
Each directory contains a package.json file, so as to a `require`-call will return the correct function
(see https://docs.npmjs.com/files/package.json for more information).

Within the plugin-folder, there also exists a `plugins.json` file.
This JSON file contains a object, with -- within the `available` property --
an object that lists all available plugins.
These plugins have te following properties:

* `id`: the id of the function, see http://users.ugent.be/~bjdmeest/function/functions.ttl for a list of already available function descriptions.
* `parameters` (optional): a list of predicates that bind the values with the function execution.
 For example, a function with declaration `function sum(a, b)` will have as `"parameters":  ["http://example.com/predA", "http://example.com/predB"]`.
* `return` (optional): the predicate that binds the return value to the semantic output of the function.
* `error` (optional): the object that maps thrown errors to predicates, to bind these errors to the semantic output of the function.
 For example, a function that throws a NotFoundException, will have `"error": {"NotFoundException": "http://example.com/notFoundOutput"}`
* `callback` (optional): the object that maps the Nth element of a function parameter list as a callbacks to other functions.
 For example: function sum(a, b, callback) can have `"callback": {3: "http://example.com/callbackFunction"}`, which shows the connection between the third parameter
 and the callback function as described by `http://example.com/callbackFunction`.