const express = require('express')
const ProductManager = require('./dao/ProductManager').ProductManager
const CartManager = require('./dao/CartManager').CartManager

const cm = new CartManager('./data/carts.json')
const pm = new ProductManager('./data/products.json')
const productsRouter = require('./routes/productsRouter')
const cartsRouter = require('./routes/cartsRouter')

const PORT = 8080
const app = express()

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

app.get('/', (req, res) => {
    res.send('Bienvenidos!!')
})

app.post("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params

    let ordenes = await cm.getOrdenes(this.path)

    let products = await pm.getProducts(this.path)

    let productoObjetivo = products.find(p => p.id == pid)

    let carritoObjetivo = ordenes.find(cart => cart.cid == cid)

    let agregarProducto = await cm.addToCart(carritoObjetivo, productoObjetivo)

    if (!productoObjetivo || !carritoObjetivo) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send('El carrito/producto no es correcto. Por favor, revise los datos')
        return

    } else {

        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(`${productoObjetivo.title} agregado al carrito ${carritoObjetivo.cid} correctamente`)
        return agregarProducto
    }
})