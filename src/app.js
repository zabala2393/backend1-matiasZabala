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

    res = JSON.stringify(products)

})

app.get("api/products/:id:", async (req, res) => {

    let productById = await products.find(p => p.id == product.id)

    if (!productById) {
        return res = console.log(`El producto con el ID ${productById.id} no existe`)
    }

})

app.post("api/products", async (req, res) => {

    let producto = await pm.addProduct()
    
    res.send = (`Producto creado exitosamente con el id ${producto.id}`)

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