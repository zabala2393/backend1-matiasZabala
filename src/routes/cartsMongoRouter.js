const Router = require('express').Router
const router = Router()
const { isValidObjectId } = require("mongoose")

const {CarritosMongoManager} = require('../dao/CarritosMongoManager')
const { ProductosMongoManager } = require('../dao/ProductosMongoManager')

router.get("/", async (req, res)=>{

    let ordenes = await CarritosMongoManager.get()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(ordenes)
    return ordenes

})

router.post("/", async (req, res) => {

    let carrito = await CarritosMongoManager.save()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(carrito)

    return carrito

})

router.get("/:cid", async (req, res) => {

    let { cid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error:`Ingrese un id valido de MongoDB`})
        }

    let carritoEncontrado = await CarritosMongoManager.getBy({_id:cid})

    if (!carritoEncontrado) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`El carrito con el CID ${cid} no existe`)

    } else {

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(carritoEncontrado)


    }
})

router.post("/:cid/product/:pid", async (req, res) => {

    let { cid } = req.params

    let {product, quantity} = req.body

    let ordenes = await CarritosMongoManager.get()

    let products = await ProductosMongoManager.get()

    let productoObjetivo = products.find(p => p.id == product.id)

    let carritoObjetivo = ordenes.find(cart => cart.cid == cid)

    let agregarProducto = await ProductosMongoManager.save()

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

router.put('/:cid', (req,res)=>{
    
})

module.exports=router