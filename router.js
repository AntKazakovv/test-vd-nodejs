const url = require('url');

module.exports.Router = class {
    handlers = []
    res = null
    req = null
    runHandler(pathname, params, method){

        for( let item of this.handlers ) {
            if(method == 'get'){
                console.log(pathname, item.route)
                if( pathname === item.route &&  JSON.stringify(params)==JSON.stringify(item.params)){
                    item.callback()
                    return null
                }
            }         
        }
        this.send('Данный запрос не обрабатывается')
    }
    get(route, params, callback){
        this.handlers.push({
                route,
                params,
                method: 'get',
                callback: callback.bind(this)
            }
        )
    }
    post(route, callback){
            this.handlers.push({
                route,
                method: 'post',
                callback: callback.bind(this)
            }
        )
    }
    send(msg){
        // добавить поддержку отправки кода
        this.res.end(msg)
    }

}

// Router.get('/test', {a: 1}, ()=>{})
// console.log(Router.handlers)