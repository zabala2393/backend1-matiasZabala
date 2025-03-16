const Router = require('express').Router
const router = Router()

router.get('/realtimeproducts', (req,res)=>{

    res.render("realTimeProducts")

})

module.exports=router