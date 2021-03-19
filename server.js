const http = require('http');
const url = require('url');
const r = require('./controllers/routes') // подключаем роутер
// const routing = require('./routing');


let server = new http.Server(function(req, res) {

    // запоминает response и request в routes
    r.routes.res = res
    r.routes.req = req
    if( req.method === 'GET' ){
        let urlRequest = url.parse(req.url, true);
        // запустить обработчик для данного request
        r.routes.runHandler(urlRequest.pathname, Object.keys(urlRequest.query), 'get')
    }
    else if( req.method === 'POST'){
        let body = '';
        // собираем тело запроса воедино из нескольких чанков
        req.on('data', chunk => {
            body += chunk.toString();
        });
        //обрабатываем тело и сам запрос
        req.on('end', () => {
            
            let contentType = req.headers['content-type']
            // пробуем распарсить body в json
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
server.listen(3000, 'localhost');