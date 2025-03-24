const { ProductManager } = require('../dao/ProductManager')
const Router = require('express').Router
const router = Router()
const pm = new ProductManager('./src/data/products.json')

router.get("/", async (req, res)=>{

    let products = await pm.getProducts(this.path)

    return res.render("productsDatabase", {products})

})

router.post('/realtimeproducts', async (req,res )=>{
   
    let {title, description, code, price, status, stock, category, thumbnails} = req.body
 
    let products = await pm.getProducts(this.path)
    
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

    const agregarProducto = await pm.addProduct(title, description, code, price, status, stock, category, [thumbnails])

    req.io.emit("agregarProducto", agregarProducto)

    return res.render("realTimeProducts", {products})}
)

router.get('/realtimeproducts', async (req, res) => {

    let products = await pm.getProducts()    

    return res.render("realTimeProducts", { products })

})

router.delete('/realtimeproducts', async(req,res)=>{

    let products = await pm.getProducts()

    let productToDelete = products.find(p=>p.id == id)

    let quitarProducto = await pm.deleteProduct(productToDelete.id)

    req.io.emit("quitarProducto", productToDelete)

    return res.render("realTimeProducts", {products})

})

module.exports = router