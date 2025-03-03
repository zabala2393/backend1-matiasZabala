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

    let products = await pm.getProducts(this.path)

    let agregarProducto = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)

    let productoDuplicado = products.find(p => p.code == code)

    if (!productoDuplicado) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: `${title} agregado correctamente con el codigo ${code}` })

    } else {

        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ payload: `Este producto ya existe en la base de datos` })
    }
}
)

app.delete("/api/products/:id", async (req, res) => {

    let { id } = req.params

    let products = await pm.getProducts(this.path)

    let productById = products.find(p => p.id == id)

    if (!productById) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`Producto con ID ${id} no existe en la base de datos`)

    } else {

        let deleteProduct = await pm.deleteProduct(productById.id)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(` El producto ha sido eliminado correctamente de la base de datos`)

    }
})

app.put("/api/products/:pid", async (req, res) => {

    let { pid } = req.params

    let { title, description, code, price, status, stock, category, thumbnails } = req.body

    let products = await pm.getProducts(pm.path)

    let productoOriginal = products[pid]

    let productoModificado = await pm.changeProduct(title, description, code, price, status, stock, category, thumbnails)

    if (productoOriginal) {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({title, description, code, price, status, stock, category, thumbnails})
        return productoModificado
    }
})

app.post("/api/carts/", async (req, res) => {

    let ordenes = await cm.getOrdenes(this.path)

    let carrito = await cm.createCart()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(`Carrito creado con exito !`)

    return carrito

})

app.get("/api/carts/:cid", async (req, res) => {

    let { cid } = req.params

    let ordenes = await cm.getOrdenes(this.path)

    let carritoEncontrado = ordenes.find(c => c.cid == cid)

    if (carritoEncontrado) {

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(carritoEncontrado.products)

    } else {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`El carrito con el CID ${cid} no existe`)
    }
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