const Router = require('express').Router
const router = Router()

const { isValidObjectId } = require('mongoose')
const { CarritosMongoManager } = require('../dao/CarritosMongoManager')
const {ProductosMongoManager} = require('../dao/ProductosMongoManager')


router.get("/", async (req, res)=>{

    let { page, limit}=req.query

    if(!page){
        page=1
    }
    if(!limit){
        limit=4
    }
    
    let {docs:products,status, payload,prevLink, nextLink, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage,asc} = await ProductosMongoManager.get(page, limit)  
    
    res.render("productsDatabase", {products, totalPages, hasNextPage, nextPage, hasNextPage, hasPrevPage, prevPage})

})

router.post('/realtimeproducts', async (req,res )=>{
   
    let {title, description, code, price, status, stock, category, thumbnails} = req.body
 
    let products = await ProductosMongoManager.get()

    try {

        let codigoDuplicado = products.find(p=>p.code == code) 
    
    if (codigoDuplicado){

        req.io.emit("errorCarga1", codigoDuplicado)
        res.render ("realTimeProducts", {products})
        return codigoDuplicado
        
    }

    let product = {title, description, code, price, status, stock, category, thumbnails}

    const agregarProducto = await ProductosMongoManager.save(product)

    req.io.emit("agregarProducto", agregarProducto)

    return res.render("realTimeProducts", {products})
        
    } catch (error) {
        
    }
    
    }
)

router.get('/realtimeproducts', async (req, res) => {

    let {page, limit}=req.query
    if(!page){
        page=1
    }
    if(!limit){
        limit=4
    }

    let {docs:products,totalPages, hasNextPage, nextPage, hasPrevPage, prevPage} = await ProductosMongoManager.get(page, limit)  

    res.render("realtimeProducts", {products, totalPages, hasNextPage, nextPage, hasNextPage, hasPrevPage, prevPage})

})

router.delete('/realtimeproducts', async(req,res)=>{

    let products = await ProductosMongoManager.get()

    let productToDelete = products.find(p=>p.id == id)

    let quitarProducto = await ProductosMongoManager.findByIdAndDelete(id, {})

    req.io.emit("quitarProducto", productToDelete)

    return res.render("realTimeProducts", {products})

})

router.get("/carts/:cid", async(req,res)=>{

    let {cid} = req.params 

    if(!isValidObjectId(cid)){

        req.io.emit("idErroneo")
        return res.render("cartId")
    }

    let cart = await CarritosMongoManager.getBy({_id:cid})

    if(!cart){


        req.io.emit("rutaErronea", cid)
    
        return res.render("cartId")


    }

    try {
        
        
    let {docs:carrito} = await CarritosMongoManager.getBy({_id:cid})

    let inCart = cart.products   
    
    res.render("cartId", { carrito , cid, inCart })

    } catch (error) {
        console.log(error.message)
    }


})

module.exports = router