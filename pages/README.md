# Request handler
Making a request to the server on the url

```/handlerName/everything/else/is/ignored ```

will invoke `handlers/handlerName.js`. Everything after the handler name is ignored for routing, but will be parsed and placed into the 'environment' object (see below).

## Handler Format
Handlers must follow one of two formats:
### Template
If you wish to use handlebars templates, you must export the `data()` function
```javascript
module.export.data = function(environment) {
...
   return { ... };
};
```
This function must return an object and there MUST be a file called `handlerName.html` in the templates directory, which should be a valid Handlebars template. Keys from the returned object will be bound to the template before it is served to the client.
### Markup
If you want to bypass templates and generate the markup for the request directly, you can export the markup() function. 
```javascript
module.export.markup = function(environment) {
...
   return "{some string data}";
}
```

This function must return a string which will be served directly to the client as the response.
## Environment
Both functions have access to the `environment` object as the first argument, should you want it. 

|Name                    |Type  |Description                                                     |Example                                                                  |
|:----------------------:|:----:|:--------------------------------------------------------------:|:-----------------------------------------------------------------------:|
|`environemnt.method`    |String|The HTTP method used by this request                            |`"GET"`                                                                  |
|`environment.headers`   |Object|HTTP headers sent in the request in key:value form              |`{"accept-encoding": "gzip, deflate, sdch", ...}`                        |
|`environment.postData`  |Object|Form data presented in the same format as above                 |Same as url.query assuming fields "with", and "querystring" exist in form|
|`environment.type`      |String|The `content-type` header that is to be served with this request|`"application/xhtml+xml"`                                                |
|`environment.connection`|Object|Information about the socket connection such as ip address      |See below                                                                |
|`environment.url`       |Object|The URL that was requested by the client, parsed                |See Below                                                                |

### Environment.connection

|Name                  |Type  |Description                                                     |Example            |
|:--------------------:|:----:|:--------------------------------------------------------------:|:-----------------:|
|`connection.address`  |String|The IP address of the remote client in string form              |`"134.324.323.123"`|
|`connection.type`     |String|What type of IP address connection - v4 or v6                   |`"IPv4"`           |
|`connection.local`    |String|The IP address of the server in string form                     |`"192.132.41.1"`   |

### Environment.url

The examples in the table below are parsed from the url `http://your.domain.com/abig/sample/url?with=some&querystring=variables`

|Name             |Type  |Description                                   |Example                                             |
|:---------------:|:----:|:--------------------------------------------:|:--------------------------------------------------:|
|`url.raw`        |String|The raw URL as it was delivered to the server |`"/abig/sample/url?with=some&querystring=variables"`|
|`url.dirs`       |Array |The directory segments of the url             |`["abig", "sample", "url"]`                         |
|`url.querystring`|String|The raw querystring                           |`"?with=some&querystring=variables"`                |
|`url.query`      |Object|The querystring as key value pairs            |`{with: "some", querystring:"variables"}`           |

