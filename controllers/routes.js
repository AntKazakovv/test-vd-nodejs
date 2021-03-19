const r = require('../router')

/*
    Модуль для описания хендлеров get и post запросов
    Используем для этого самописный модуль router
*/
let router = new r.Router()

// создаем обработчик get, передаем в него path, название параметров и callback
router.get('/source', [], function(){
    this.sendFile(__dirname + '/routes.js')
})

router.get('/hello', ['name'], function(){
    let params = this.getParams()
    this.send(`<h1>HELLO ${params.name}</h1>`)
})

router.get('/hello', [], function(){

    this.send(`<h1>HELLO WORLD</h1>`)
})

router.get('/admin', [], function(){
    if( this.auth === 'test' ){
        this.send('<h1>Hello, test</h1>')
        this.auth = null
    }
    else{
        this.send('Доступ без авторизации не возможен', 401)
    }
})

//в запросе передаются слогаемые x, если они удовлетворяют условию четности, то входят в сумму
// ? возможно я не правильно понял задачу, но вот реализация как я это понял )
router.post('/sum', ['x'], function(){
    let params = this.getParams()
    if( !Array.isArray(params.x) ){
        params.x = [params.x]
    }
    let result = params.x.reduce( (sum, numb) => { return sum += !(numb % 2) ? Number(numb) : 0 }, 0)
    this.send(JSON.stringify({'result': result}))
})


// и на всякий случай с передачей x в формате json через тело запроса
router.post('/sum', [], function(){
    let params = this.getPayload()
    if( !Array.isArray(params.x) ){
        params.x = [params.x]
    }
    let result = params.x.reduce( (sum, numb) => { return sum += !(numb % 2) ? Number(numb) : 0 }, 0)
    this.send(JSON.stringify({'result': result}))
})


router.post('/sort', ['x'], function(){
    let params = this.getParams()
    if( !Array.isArray(params.x) ){
        params.x = [params.x]
    }
    let result = params.x
                    .map( i => Number(i) )
                    .sort( (a,b)=> { return a-b } )

    this.send(JSON.stringify({'result': result}))
})



module.exports.routes = router