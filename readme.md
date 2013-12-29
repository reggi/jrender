# jRender

Edit your views with a jQuery server-side postprocessor.

## Installation

```
npm install jrender --save
```

## Setup

Here's the middleware in app.js.

```
var jrender = require("jrender");
app.use(jrender());
``` 

## Usage

Here's a route.

```
var route = function(req, res, next){
    res.jrender('index', { title: 'Express' }, function($){
        $("title").attr("jquery","awesome");
    });
};
```

If you need the string, and don't wanna send you can pass in the last callback.

```
var route = function(req, res, next){
    res.jrender('index', { title: 'Express' }, function($){
        $("title").attr("jquery","awesome");
    }, function(err, html){
        if(err) return next(err);
        return res.send(html);
    });
};
```