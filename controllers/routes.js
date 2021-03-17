const r = require('../router')

let router = new r.Router()


router.get('/test', ['name'], function(){
    console.log('1')
    this.send('HELLO WORLD')
})

module.exports.routes = router