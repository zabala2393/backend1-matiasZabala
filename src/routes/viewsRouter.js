const Router = require('express').Router
const router = Router()
const {ProductosMongoManager} = require('../dao/ProductosMongoManager')

router.get("/", async (req, res)=>{

    let products = await ProductosMongoManager.get()

    return res.render("productsDatabase", {products})

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

    let products = await ProductosMongoManager.get()    

    return res.render("realTimeProducts", { products })

})

router.delete('/realtimeproducts', async(req,res)=>{

    let products = await ProductosMongoManager.get()

    let productToDelete = products.find(p=>p.id == id)

    let quitarProducto = await ProductosMongoManager.findByIdAndDelete(id, {})

    req.io.emit("quitarProducto", productToDelete)

    return res.render("realTimeProducts", {products})

})

module.exports = router