# Request handler
Making a request to the server on the url

```/handlerName/everything/else/is/ignored ```

will invoke ```handlers/handlerName.js```. Everything after the handler name is ignored for routing, but will be parsed and placed into the 'environment' object (see below).

## Handler Format
Handlers must follow one of two formats:
### Template
If you wish to use handlebars templates, you must export the  date() function
```javascript
module.export.data = function() {
...
   return { ... };
};
```
This function must return an object and there MUST be a file called ```handlerName.html``` in the templates directory, which should be a valid Handlebars template. Keys from the returned object will be bound to the template before it is served to the client.
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
Both functions have access to the ```environment``` object as the first argument, should you want it. This will take the following format:
- ```environment.query``` query string data presented as an object with key:value pairs, so if the url was ```http://yourdoman/thispage/url/?andsome=query&string=variables```, this would contain
```javascript
{
   andsome: "query",
   string : "variables"
}
```
- ```environment.type``` The ```content-type``` header that is to be served with this request
- ```environment.path``` An array containing the parsed directory segments of the url. So for the example url used above, this would contain ```["thispage", "url"]```
