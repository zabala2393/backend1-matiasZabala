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

    let productoDuplicado = products.find(p => p.title.toLowerCase() == title.toLowerCase())

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

    let { title, description, code, price, status, category, stock, thumbnails } = req.body

    let products = await pm.getProducts()

    let productoOriginal = products.find(p => p.id == pid)

    let indiceProducto = products.indexOf(productoOriginal) 

    if (indiceProducto <= -1) {

        return res.status(404).send(`No existe un producto con el ID ${pid}`)

    }

    let id = pid

    let aModificar = {title, description, price, stock}

    if (title && description && price && stock) {

    let modificarProducto = await pm.changeProduct(pid, aModificar)

} else {

    return res.status(400).send(`Faltan propiedades a modificar! Ingrese title, description, price y stock`)
}

    if (aModificar) {

        return res.status(200).send(`Producto ${productoOriginal.title} modificado con exito`)
    
        
    }
}
)

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