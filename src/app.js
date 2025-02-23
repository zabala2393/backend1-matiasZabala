const express = require('express')
const ProductManager = require('./dao/ProductManager').ProductManager
const CartManager = require('./dao/CartManager').CartManager

const cm = new CartManager('./data/carts.json')
const pm = new ProductManager('./data/products.json')
const PORT = 8080
const app = express()

app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

app.get('/', (req, res) => {
    res.send('Bienvenidos!!')
})

app.get("/api/products", async (req, res) => {

    let products = await pm.getProducts(this.path)
    res.send(`Listado de productos: ${products}`)

})

app.get("/api/products/:id", async (req, res) => {

    let {id} = req.params

    let products = await pm.getProducts(this.path)

    let productById = products.find(p => p.id == id)   

    if (!productById) {
        res.status(404).send(`El producto con el ID ${id} no existe`)
    } else {
        res.status(200).send(productById)
    }

})

app.post("/api/products", async (req, res) => {

    let products = await pm.getProducts(this.path)

    let productoExiste = products.find(p=>prod.id == producto.id)

    

})

app.post("/:cid/products/:id", async (req,res)=>{

    let carrito = await cm.createCart()

    let productoElegido = products.find(p=>p.id == product.id)

    let isInCart = carrito.some(p=>p.id == productoElegido.id)

    let count = productoElegido.quantity

    if(isInCart) {
        console.log(`El producto ${productoElegido.title} ya existe en carrito`)
        return carrito.values(productoElegido.quantity + count)
    }
})