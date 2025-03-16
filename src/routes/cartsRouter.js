const Router = require('express').Router
const router = Router()

const ProductManager = require('../dao/ProductManager').ProductManager
const CartManager = require('../dao/CartManager').CartManager

const cm = new CartManager('./data/carts.json')
const pm = new ProductManager('./data/products.json')

router.post("/", async (req, res) => {

    let ordenes = await cm.getOrdenes(this.path)

    let carrito = await cm.createCart()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(`Carrito creado con exito !`)

    return carrito

})

router.get("/:cid", async (req, res) => {

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

router.post("/:cid/product/:pid", async (req, res) => {

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
module.exports=router