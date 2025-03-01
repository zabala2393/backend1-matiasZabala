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

    let productoDuplicado = products.find(p=>p.code == code)

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

    let productById = products.find(p=>p.id == id)
    
    if (!productById) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`Producto con ID ${id} no existe en la base de datos`)

    } else {

        let deleteProduct = await pm.deleteProduct(productById.id)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(` El producto ha sido eliminado correctamente de la base de datos`)

    }


})

app.put("/api/products/:pid:", async (req, res) => {

    let { pid } = req.params

    let { title, description, code, price, status, stock, category, thumbnails } = req.body

    let products = await pm.getProducts(pm.path)

    productoOriginal = products.find(p => p.id == pid)



})

app.post("/:cid/products/:id", async (req, res) => {

    let { cid, id } = req.params

    let carrito = await cm.createCart(cm.path)

    return carrito

})