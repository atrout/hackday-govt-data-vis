var sys = require("sys"),
    static = require('node-static'),
    http = require("http"),
    url = require("url"),
    filesys = require("fs"),
    util = require("util");

var webroot = './public',
    port = 8080;

var file = new(static.Server)(webroot, { 
  cache: 600, 
  headers: { 'X-Powered-By': 'node-static' } 
});


var indexHtml = filesys.readFileSync('./public/index.html');

// TODO: improve this. should be able to get whatever data with better api calls
http.createServer(function(request, response) {
    if (request.url === '/gdp') {
        var self = response ;

        var options = {
            host: "api.stlouisfed.org",
            port: 80,
            path: "/fred/series/observations?series_id=USARGDPC&api_key=8fb0d05280c678807993e6ef5e7e95a4&file_type=json",
            method: "GET"
        }
        
        var callback = function(response) {
            console.log("gdp request status: " + response.statusCode);
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            
            response.on('end', function() {
                console.info("got the data!");
                self.writeHeader(200, {"Content-Type": "application/json"});
                self.write(str);
                self.end();
            });
        }
        
        http.request(options, callback).end();
    } else if (request.url === '/gdpjapan') {
        var self = response ;

        var options = {
            host: "api.stlouisfed.org",
            port: 80,
            path: "/fred/series/observations?series_id=JPNRGDPC&api_key=8fb0d05280c678807993e6ef5e7e95a4&file_type=json",
            method: "GET"
        }
        
        var callback = function(response) {
            console.log("gdp request status: " + response.statusCode);
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            
            response.on('end', function() {
                console.info("got the data!");
                self.writeHeader(200, {"Content-Type": "application/json"});
                self.write(str);
                self.end();
            });
        }
        
        http.request(options, callback).end();
    } else {
        file.serve(request, response, function(err, result) {
          if (err) {
            console.error('Error serving %s - %s', request.url, err.message);
            if (err.status === 404 || err.status === 500) {
              file.serveFile(util.format('/%d.html', err.status), err.status, {}, request, response);
            } else {
              response.writeHead(err.status, err.headers);
              response.end();
            }
          } else {
            console.log('%s - %s', request.url, response.message); 
          }
        });
    }
}).listen(port);
sys.puts("Server Running on 8080");

