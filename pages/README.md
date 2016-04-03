# Request handler
Making a request to the server on the url

```/handlerName/everything/else/is/ignored ```

will invoke `handlers/handlerName.js`. Everything after the handler name is ignored for routing, but will be parsed and placed into the 'environment' object (see below).

## Handler Format
Handlers must follow one of two formats:
### Template
If you wish to use handlebars templates, you must export the `data()` function
```javascript
module.export.data = function() {
...
   return { ... };
};
```
This function must return an object and there MUST be a file called `handlerName.html` in the templates directory, which should be a valid Handlebars template. Keys from the returned object will be bound to the template before it is served to the client.
### Markup
If you want to bypass templates and generate the markup for the request directly, you can export the markup() function. 
```javascript
module.export.markup = function() {
...
   return "{some string data}";
}
```

This function must return a string which will be served directly to the client as the response.
## Environment
Both functions have access to the `environment` object as the first argument, should you want it. This will take the following format:

|Name                  |Type  |Description                                                     |Example                                          |
|----------------------|------|----------------------------------------------------------------|-------------------------------------------------|
|`environment.type`    |String|The `content-type` header served with this request              |"text/html"                                      |
|`environment.query`   |Object|query string data presented as an object with key:value pairs   |`\?ab=cd&df=gh` => `{ ab: "cd", df:"gh"}`        |
|`environment.postData`|Object|Form data presented in the same format as above                 |Same as above, assuming field names "ab" and "df"|
|`environment.type`    |String|The `content-type` header that is to be served with this request|"application/xhtml+xml"                          |
|`environment.path`    |Array |The parsed directory segments of the url                        |`\this\big\path` => `["this", "big", "path"]`    |
|`environemnt.method`  |String|The HTTP method used by this request                            |"GET"                                            |
