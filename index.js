var _ = require("underscore");
var fs = require("fs");
var async = require("async");
var jsdom = require("jsdom");
var waterfall = {};

var jrender = function(res){
    return function(view, params, code, callback){

        waterfall.pass = function(callback){
            return callback(null, {});
        }

        waterfall.html = function(pass, callback){
            return res.render(view, params, function(err, html){
                if(err) return callback(err);
                pass.html = html;
                return callback(null, pass);
            });
        }

        waterfall.src = function(pass, callback){
            if(!code) return callback(null, pass);
            fs.readFile("./node_modules/jrender/node_modules/jquery/dist/jquery.js", "utf-8", function(err, src){
                if(err) return callback(err);
                pass.src = src;
                return callback(null, pass);
            });
        }

        waterfall.jquery = function(pass, callback){
            if(!code) return callback(null, pass);
            jsdom.env({
                html: pass.html,
                src: [pass.src],
                done: function(err, window){
                    if(err) return callback(err);
                    pass.window = window;
                    return callback(null, pass);
                }
            });
        }

        waterfall.code = function(pass, callback){
            if(!code) return callback(null, pass);
            var window = pass.window;
            var document = pass.window.document;
            var $ = window.jQuery;
            code($);
            pass.html = $(document).children().prop('outerHTML');
            return callback(null, pass);
        }

        return async.waterfall([
            waterfall.pass,
            waterfall.html,
            waterfall.src,
            waterfall.jquery,
            waterfall.code
        ], function(err, pass){
            if(err){
                if(callback) return callback(err);
                return err;
            }
            var html = pass.html;
            if(callback) return callback(null, html);
            return res.send(html);
        });

    }
}

module.exports = function(){
    return function(req, res, next){
        res.jrender = jrender(res);
        return next();
    }
}