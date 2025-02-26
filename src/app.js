const express = require('express')
const ProductManager = require('./dao/ProductManager').ProductManager
const CartManager = require('./dao/CartManager').CartManager

const cm = new CartManager('./data/carts.json')
const pm = new ProductManager('./data/products.json')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

app.get('/', (req, res) => {
    res.send('Bienvenidos!!')
})

app.get("/api/products", async (req, res) => {

    let products = await pm.getProducts(this.path)
    res.status(200).json(products)

})

app.get("/api/products/:id", async (req, res) => {

    let { id } = req.params

    let products = await pm.getProducts(this.path)

    let productById = products.find(p => p.id == id)

    if (!productById) {
        res.status(404).send(`El producto con el ID ${id} no existe`)
    } else {
        res.status(200).json(productById)
    }
})

app.post("/api/products", async (req, res) => {

    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    let productoNuevo = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)

    console.log(productoNuevo)

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ payload: `${title} agregado correctamente con el codigo ${code}` })
}
)

app.put("/api/products/:pid:", async (req, res) => {

    let { pid } = req.params

    let products = await pm.getProducts(pm.path)

    productoOriginal = products.find(p => p.id == pid)

})

app.post("/:cid/products/:id", async (req, res) => {

    let { cid, id } = req.params

    let carrito = await cm.createCart(cm.path)

    return carrito

})