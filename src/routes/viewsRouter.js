const {ProductManager} = require('../dao/ProductManager')
const Router = require('express').Router
const router = Router()
const pm = new ProductManager('./data/products.json')

router.get('/realtimeproducts', async (req,res)=>{  
   
    let products = await pm.getProducts(this.path) 
    
    return res.render("realTimeProducts", {products})

})

module.exports=router