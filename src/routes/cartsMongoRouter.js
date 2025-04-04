const Router = require('express').Router
const router = Router()
const { isValidObjectId, Types } = require("mongoose")
const { CarritosMongoManager } = require('../dao/CarritosMongoManager')
const { ProductosMongoManager } = require('../dao/ProductosMongoManager')

router.get("/", async (req, res) => {

    try {
        let carts = await CarritosMongoManager.get()

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ carts })

    } catch (error) {

        console.log(error.message)
    }


})

router.post("/", async (req, res) => {

    let carrito = await CarritosMongoManager.save()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(carrito)

    return carrito

})

router.get("/:cid", async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `Ingrese un id valido de MongoDB` })
    }

    let carritoEncontrado = await CarritosMongoManager.getBy({ _id: cid }, { lean: true })

    if (!carritoEncontrado) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`El carrito con el CID ${cid} no existe`)

    } else {

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(carritoEncontrado)


    }
})

router.post("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params

    let { quantity } = req.body

    let validar = isNaN(quantity)

    if (!quantity || validar) {

        res.setHeader('Content-Type', 'application/json')
        res.status(401).send('Por favor, ingrese la cantidad correcta que desea agregar del producto')
        return
    }

    let cantidadIngresada = parseFloat(quantity)

    let productoObjetivo = await ProductosMongoManager.getBy({ _id: pid })

    let carritoObjetivo = await CarritosMongoManager.getBy({ _id: cid })

    if (!productoObjetivo || !carritoObjetivo) {
        res.setHeader('Content-Type', 'application/json')
        res.status(404).send('El carrito/producto no existe. Por favor, revise los datos')
        return
    }

    try {

        let cart = await CarritosMongoManager.getBy(carritoObjetivo._id, { lean: true })

        let cartFlat = cart.products.flat(Infinity)

        let productosIndividuales = JSON.stringify(cartFlat, null)

        let existe = productosIndividuales.match(productoObjetivo._id)

        if (existe) {

            const indiceProducto = cartFlat.findIndex(item => {
                if (
                    item &&
                    typeof item === 'object' &&
                    item.hasOwnProperty('product') &&
                    item.product &&
                    typeof item.product === 'object' &&
                    item.product.hasOwnProperty('_id')
                ) {
                    return String(item.product._id) === pid
                }
            }
            )

            let cantidadAnterior = cartFlat[indiceProducto].quantity

            let cantidadActualizada = cantidadAnterior + cantidadIngresada

            let borrarProducto = cart.products.splice(indiceProducto,1 )

            let productonuevo = cart.products.push({product:productoObjetivo, quantity:cantidadActualizada})

            let actualizarCarrito = await CarritosMongoManager.update(cid, cart)

            res.setHeader('Content-Type', 'application/json')

            return res.status(200).json(actualizarCarrito)

        } else {

            let agregarproducto = cart.products.push({ product: productoObjetivo, quantity: cantidadIngresada })

            let actualizarCarrito = await CarritosMongoManager.update(cid, cart)

            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json(actualizarCarrito)
        }

    } catch (error) {
        return console.log(error.message)

    }
})

router.put('/:cid/product/:pid', async (req, res) => {

    let { cid, pid } = req.params

    let { quantity } = req.body

    let validar = isNaN(quantity)

    if (!quantity || validar) {

        res.setHeader('Content-Type', 'application/json')
        res.status(401).send('Por favor, ingrese la cantidad correcta que desea agregar del producto')
        return
    }

    let cantidadIngresada = parseFloat(quantity)

    let productoObjetivo = await ProductosMongoManager.getBy({ _id: pid })

    let carritoObjetivo = await CarritosMongoManager.getBy({ _id: cid })

    if (!productoObjetivo || !carritoObjetivo) {
        res.setHeader('Content-Type', 'application/json')
        res.status(404).send('El carrito/producto no existe. Por favor, revise los datos')
        return
    }

    try {

        let cart = await CarritosMongoManager.getBy(carritoObjetivo._id, { lean: true })

        let cartFlat = cart.products.flat(Infinity)

        let productosIndividuales = JSON.stringify(cartFlat, null)

        let existe = productosIndividuales.match(productoObjetivo._id)

        if (existe) {

            const indiceProducto = cartFlat.findIndex(item => {
                if (
                    item &&
                    typeof item === 'object' &&
                    item.hasOwnProperty('product') &&
                    item.product &&
                    typeof item.product === 'object' &&
                    item.product.hasOwnProperty('_id')
                ) {
                    return String(item.product._id) === pid
                }
            }
            )

            let cantidadAnterior = cartFlat[indiceProducto].quantity

            let cantidadActualizada = cantidadAnterior + cantidadIngresada

            let borrarProducto = cart.products.splice(indiceProducto,1 )

            let productonuevo = cart.products.push({product:productoObjetivo, quantity:cantidadActualizada})

            let actualizarCarrito = await CarritosMongoManager.update(cid, cart)

            res.setHeader('Content-Type', 'application/json')

            return res.status(200).json(actualizarCarrito)

        } else {

            let agregarproducto = cart.products.push({ product: productoObjetivo, quantity: cantidadIngresada })

            let actualizarCarrito = await CarritosMongoManager.update(cid, cart)
            
            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json(actualizarCarrito)
        }

    } catch (error) {
        return console.log(error.message)

    }
})

router.delete("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params

    let cart = await CarritosMongoManager.getBy({ _id: cid })

    let product = await ProductosMongoManager.getBy({ _id: pid })

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({ error: `Ingrese un ID valido de MongoDB` })
    }

    if (!product || !cart) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({ error: `Carrito no valido o producto no existente en carrito` })
    }

    let cartFlat = cart.products.flat(Infinity)

    let productosIndividuales = JSON.stringify(cartFlat, null)

    let existe = productosIndividuales.match(product._id)

    if (existe) {

        const indiceProducto = cartFlat.findIndex(item => {
            if (
                item &&
                typeof item === 'object' &&
                item.hasOwnProperty('product') &&
                item.product &&
                typeof item.product === 'object' &&
                item.product.hasOwnProperty('_id')

            ) {

                return String(item.product._id) === pid
            }
        }
        )

        console.log(indiceProducto)

        let borrarProducto = cart.products.splice(indiceProducto, 1)

        let actualizarCarrito = await CarritosMongoManager.update(cid, cart)

        console.log(actualizarCarrito)

        req.io.emit("borrarProducto", actualizarCarrito)
        res.setHeader('Content-Type', 'application/json')
        res.status(401).json({ payload: `Producto ${product.title} eliminado del carrito con exito` })
        return res.render("cartId")

    } else {
        
        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({ error: `Carrito no valido o producto no existente en carrito` })
    }


})

router.delete('/:cid', async (req, res) => {

    try {

        let { cid } = req.params

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Ingrese un ID valido de MongoDB` })
        }

        let vaciarCarrito = await CarritosMongoManager.update(cid, { products: [] }, { new: true })

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ payload: `Carrito vaciado con exito` })

    } catch (error) {

        console.log(error.message)

    }
})

module.exports = router