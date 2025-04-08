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

    let quantity = 1

    let cantidadIngresada = parseFloat(quantity)


    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `Ingrese un ID valido de MongoDB` })

    }

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

            let borrarProducto = cart.products.splice(indiceProducto, 1)

            let productonuevo = cart.products.push({ product: productoObjetivo, quantity: cantidadActualizada })

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
        console.log(error.message)

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

            let borrarProducto = cart.products.splice(indiceProducto, 1)

            let productonuevo = cart.products.push({ product: productoObjetivo, quantity: cantidadActualizada })

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

    try {

        let { cid, pid } = req.params

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(401).json({ error: `Ingrese IDs validos de MongoDB` })
        }

        let cart = await CarritosMongoManager.getBy({ _id: cid })

        let product = await ProductosMongoManager.getBy({ _id: pid })

        if (!cart) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Carrito no valido` })
        }

        if (!product) {

            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({ error: `Producto no existe en la base de datos` })
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

            let borrarProducto = cart.products.splice(indiceProducto, 1)

            let actualizarCarrito = await CarritosMongoManager.update(cid, cart)

            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({ payload: `Producto ${product.title} eliminado del carrito con exito` })
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(404).json({ payload: `El producto ingresado no existe en el carrito` })
        }

    } catch (error) {

        console.log(error.message)

    }


})

router.put("/:cid", async (req, res) => {

    let { cid } = req.params

    if (!isValidObjectId(cid)) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({ message: "Ingrese un ID valido de MongoDB" })
    }

    try {

        let arrayProductos = req.body.products

        let cantidades = req.body.products

        async function validateArray(array) {
            if (!array || array.length === 0) {
                return true
            }

            for (const item of array) {
                try {

                    const products = await ProductosMongoManager.getBy({ _id: item.product })

                    if(!item.quantity){
                        return false
                    }

                    if (!products || products.length === 0) {

                        return false
                    }

                } catch (error) {
                    console.error("Error al consultar la base de datos MongoDB:", error);
                    return false
                }
            }

            return true
        }

        let productosValidos = await validateArray(arrayProductos)

        if (!productosValidos) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({ error: `Los productos o cantidades no son correctos! Revise los datos ingresados` })
        }

        let cart = await CarritosMongoManager.getBy({ _id: cid })

        if (!cart) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `El ID de carrito ingresado no existe` })
        }

        let vaciarCarrito = await CarritosMongoManager.update(cid, { products: [] }, { new: true })

        let carritoNuevo = await CarritosMongoManager.update(cid, { products: arrayProductos })

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(carritoNuevo)

    } catch (error) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({ error: error.message })
    }

})

router.delete('/:cid', async (req, res) => {

    try {

        let { cid } = req.params

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Ingrese un ID valido de MongoDB` })
        }

        let cart = await CarritosMongoManager.getBy({_id:cid})

        if(!cart){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({ payload: `No existe carrito con este ID` })
        }

        let vaciarCarrito = await CarritosMongoManager.update(cid, { products: [] }, { new: true })

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ payload: `Carrito vaciado con exito` })

    } catch (error) {

        console.log(error.message)

    }
})

module.exports = router