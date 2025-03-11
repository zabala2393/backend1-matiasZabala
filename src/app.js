const express = require("express")
const app = express()
const {Server} = require('socket.io')
const {engine} = require('express-handlebars')


const ProductManager = require('./dao/ProductManager').ProductManager
const CartManager = require('./dao/CartManager').CartManager

const cm = new CartManager('./data/carts.json')
const pm = new ProductManager('./data/products.json')
const productsRouter = require('./routes/productsRouter')
const cartsRouter = require('./routes/cartsRouter')
const viewsRouter = require('./routes/viewsRouter')
const { log, errorhandler } = require("./middlewares/errorHandler")

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))
app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", './src/views')
app.use(log)

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

const serverHttp = app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

const io = new Server(serverHttp)

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

app.use(errorhandler)