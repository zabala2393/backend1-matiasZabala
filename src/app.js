const express = require('express')
const ProductManager = require('./dao/ProductManager').ProductManager

const pm = new ProductManager('./data/products.json')

const PORT = 8080

const app = express()

app.listen(PORT, () => {

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

    res.send = JSON.stringify(producto)

})