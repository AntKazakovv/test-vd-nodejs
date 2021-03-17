const http = require('http');
const url = require('url');
const r = require('./controllers/routes')
// const routing = require('./routing');


let server = new http.Server(function(req, res) {
 
    var dataString = '';

    res.setHeader('Content-Type', 'application/json');
    r.routes.res = res
    if( req.method == 'GET' ){
        let urlRequest = url.parse(req.url, true);
        r.routes.runHandler(urlRequest.pathname, Object.keys(urlRequest.query), 'get')
    }
    else if( req.method == 'POST'){
        console.log('post')
    }
    else{
        res.end('<h1>Не умею работать с чем то кроме GET/POST</h1>')
    }
});

server.listen(3001, 'localhost');