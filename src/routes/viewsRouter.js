const Router = require('express').Router
const router = Router()

const { isValidObjectId } = require('mongoose')
const { CarritosMongoManager } = require('../dao/CarritosMongoManager')
const { ProductosMongoManager } = require('../dao/ProductosMongoManager')

router.get("/", async (req, res) => {

    try {

        let { page, limit, sort } = req.query

        let query = {}

        for (const filtro in req.query) {
            if (filtro !== 'page' && filtro !== 'limit' && filtro !== 'sort') {
                query[filtro] = req.query[filtro]
            }
        }

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 4
        }

        if (!sort) {
            sort = "desc"
        }

        let { docs: products, status, payload, prevLink, nextLink, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage } = await ProductosMongoManager.get(page, limit, sort, query)

        res.render("productsDatabase", { products, totalPages, hasNextPage, nextPage, hasNextPage, hasPrevPage, prevPage })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }


})

router.post('/realtimeproducts', async (req, res) => {

    try {

        let { title, description, code, price, status, stock, category, thumbnails } = req.body

        let { docs: products } = await ProductosMongoManager.get()

        let stringProductos = JSON.stringify(products)

        let product = { title, description, code, price, status, stock, category, thumbnails }

        const agregarProducto = await ProductosMongoManager.save(product)

        req.io.emit("agregarProducto", agregarProducto)

        return res.render("realTimeProducts", { products })

    } catch (error) {

        req.io.emit("errorCarga2", code)
        return
    }

}
)

router.get('/realtimeproducts', async (req, res) => {

    try {

        let { page, limit, sort } = req.query

        let query = {}

        for (const filtro in req.query) {
            if (filtro !== 'page' && filtro !== 'limit' && filtro !== 'sort') {
                query[filtro] = req.query[filtro]
            }
        }

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 4
        }

        if (!sort) {
            sort = "desc"
        }

        let { docs: products, status, payload, prevLink, nextLink, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage } = await ProductosMongoManager.get(page, limit, sort, query)

        res.render("realTimeProducts", { products, totalPages, hasNextPage, nextPage, hasNextPage, hasPrevPage, prevPage })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/realtimeproducts', async (req, res) => {
    try {

        let products = await ProductosMongoManager.get()

        let productToDelete = products.find(p => p.id == id)

        let quitarProducto = await ProductosMongoManager.findByIdAndDelete(id, {})

        req.io.emit("quitarProducto", productToDelete)

        return res.render("realTimeProducts", { products })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }


})

router.get("/carts/:cid", async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {

        req.io.emit("idErroneo")
        return res.render("cartId")
    }

    let cart = await CarritosMongoManager.getBy({ _id: cid })

    if (!cart) {
        req.io.emit("rutaErronea", cid)
        return res.render("cartId")
    }

    try {

        let inCart = cart.products
        res.render("cartId", { cid, inCart })

    } catch (error) {

        console.log(error.message)
        res.status(500).send("Error al obterner el carrito")
        
    }


})

module.exports = router