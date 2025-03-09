const Router = require('express').Router
const router = Router()

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

module.exports=router