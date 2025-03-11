const Router = require('express').Router
const router = Router()

router.get('/pruebas', (req,res)=>{

    res.render("ejemplo")

})

module.exports=router