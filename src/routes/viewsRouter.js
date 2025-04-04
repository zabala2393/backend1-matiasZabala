const Router = require('express').Router
const router = Router()

const { CarritosMongoManager } = require('../dao/CarritosMongoManager')
const {ProductosMongoManager} = require('../dao/ProductosMongoManager')


router.get("/", async (req, res)=>{

    let {page, limit}=req.query
    if(!page){
        page=1
    }
    if(!limit){
        limit=4
    }
    
    let {docs:products,status, payload,prevLink, nextLink, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage} = await ProductosMongoManager.get(page, limit)

    res.render("productsDatabase", {products, totalPages, hasNextPage, nextPage, hasNextPage, hasPrevPage, prevPage})

})

router.post('/realtimeproducts', async (req,res )=>{
   
    let {title, description, code, price, status, stock, category, thumbnails} = req.body
 
    let products = await ProductosMongoManager.get()
    
    let codigoDuplicado = products.find(p=>p.code == code)

    let productoDuplicado = products.find(p=>p.title == title)
    
    if (codigoDuplicado){

        req.io.emit("errorCarga1", codigoDuplicado)
        res.render ("realTimeProducts", {products})
        return codigoDuplicado
        
    }

    if (productoDuplicado) {
        req.io.emit("errorCarga2", productoDuplicado)
        res.render ("realTimeProducts", {products})
        return productoDuplicado
    }

    let product = {title, description, code, price, status, stock, category, thumbnails}

    const agregarProducto = await ProductosMongoManager.save(product)

    req.io.emit("agregarProducto", agregarProducto)

    return res.render("realTimeProducts", {products})}
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

    let cart = await CarritosMongoManager.getBy({_id:cid})

    let {docs:carrito} = await CarritosMongoManager.getBy({_id:cid})

    let inCart = cart.products 
    
    req.io.emit("borrarProducto")
    
    res.render("cartId", { carrito , cid, inCart })

})

module.exports = router