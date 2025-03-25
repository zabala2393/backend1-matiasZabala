const Router = require('express').Router
const router = Router()

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
    res.status(200).send(`Carrito creado con exito !`)

    return carrito

})

router.get("/:cid", async (req, res) => {

    let { cid } = req.params

    let ordenes = await CarritosMongoManager.get()

    let carritoEncontrado = ordenes.find(cid)

    if (carritoEncontrado) {

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(carritoEncontrado)

    } else {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`El carrito con el CID ${cid} no existe`)
    }
})

router.post("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params

    let {quantity} = req.body

    let ordenes = await CarritosMongoManager.get()

    let products = await ProductosMongoManager.get()

    let productoObjetivo = products.find(p => p.id == pid)

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