const url = require('url');
const fs = require("fs")

module.exports.Router = class {
    handlers = [] // список объектов описывающих хендлеры
    res = null
    req = null
    auth = null
    body = null

    setHeaders(headers){
        for(let header in headers){
            this.res.setHeader(header, headers[header])
        }
    }
    // по заданным пути, списку параметров и методу проверить,
    // есть ли в handlers соответствующий обработчик, вернуть его,
    // в противном случае, вернуть false
    findGetHandler(pathname, params, method){
        for( let item of this.handlers ) {
            if( pathname === item.route && method === item.method &&  JSON.stringify(params)===JSON.stringify(item.params)){
                return item
            }
        }
        return false
    }
    // запустить выполнение обработчика
    runHandler(pathname, params, method){   
        let targetHandler = this.findGetHandler(pathname, params, method)
        if( targetHandler ){ // в случае, если у нас есть обработчик для текущего запроса
            if(this.req.headers['authorization']){
                this.auth = this.req.headers['authorization']
            }
            if(method === 'get'){
                this.setHeaders({
                    'Content-Type': "text/html; charset=utf-8;"
                })
            }
            else{
                this.setHeaders({
                    'Content-Type': "application/json;"
                })   
            }

            targetHandler.callback()
        }
        else{
            this.send('Данный запрос не обрабатывается', 404)
        }
        
    }
    get(route, params, callback){
        if( !this.findGetHandler(route, params, 'get') ){ // если уже нет такого хендлера
            this.handlers.push({
                    route,
                    params,
                    method: 'get',
                    callback: callback.bind(this)
                }
            )
        }
        else{
            throw new Error(`Обработчик "${route}" с параметрами <${params}> был реализован ранее`)
        }

    }
    post(route, params, callback){
        if( !this.findGetHandler(route, params, 'post') ){
            this.handlers.push({
                route,
                params,
                method: 'post',
                callback: callback.bind(this)
            })
        }
        else{
            throw new Error(`Обработчик "${route}" с параметрами <${params}> был реализован ранее`)
        }
    }
    send(msg, status=200){
        this.res.statusCode = status
        this.res.end(msg)
    }

    getParams(){
        return (url.parse(this.req.url, true)).query
    }

    getPayload(){
        if( this.req.method == 'GET' ){
            return {}
        }
        return this.body
    }

    sendFile(path){
        fs.access(path, fs.constants.R_OK, err => {
            // если произошла ошибка - отправляем статусный код 404
            if(err){
                this.send("Ресурс не найден", 404)
            }
            else{
                fs.createReadStream(path).pipe(this.res);
            }
          });
    }

}