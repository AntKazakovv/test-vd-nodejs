const http = require('http');
const url = require('url');
const r = require('./controllers/routes')
// const routing = require('./routing');


let server = new http.Server(function(req, res) {
 
    var dataString = '';

    res.setHeader('Content-Type', 'application/json');
    r.routes.res = res
    r.routes.req = req
    if( req.method == 'GET' ){
        let urlRequest = url.parse(req.url, true);
        r.routes.runHandler(urlRequest.pathname, Object.keys(urlRequest.query), 'get')
    }
    else if( req.method == 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let contentType = req.headers['content-type']

            let data = contentType === 'application/json' ? JSON.parse(body) : body 
            let urlRequest = url.parse(req.url, true);
            r.routes.body = data
            r.routes.runHandler(urlRequest.pathname, Object.keys(urlRequest.query), 'post')
        });
    }
    else{
        res.end('<h1>Не умею работать с чем то кроме GET/POST</h1>')
    }
});

module.exports.server = server

console.info('Start server!')
server.listen(3001, 'localhost');