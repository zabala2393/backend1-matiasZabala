const Router = require('express').Router
const router = Router()
const { isValidObjectId } = require("mongoose")

const {CarritosMongoManager} = require('../dao/CarritosMongoManager')
const { ProductosMongoManager } = require('../dao/ProductosMongoManager')
const { carritoModelo } = require('../dao/models/carritoModelo')

router.get("/", async (req, res)=>{

try {
    let carritos = await CarritosMongoManager.get()

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({carritos})
       
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

router.put("/:cid/product/:pid", async (req, res) => {

    let {cid, pid} = req.params

    let {quantity} = req.body    

    let carritoObjetivo = await CarritosMongoManager.getBy({_id:cid})

    let productoObjetivo = await ProductosMongoManager.getBy({_id:pid})   

    if (!productoObjetivo || !carritoObjetivo) {
        res.setHeader('Content-Type', 'application/json')
        res.status(404).send('El carrito/producto no existe. Por favor, revise los datos')
        return}

        let products = carritoObjetivo.products

        let aModificar = {...products, productoObjetivo, quantity} 

try {
        let carritoActualizado = await CarritosMongoManager.update(carritoObjetivo, {products:aModificar})
       
        
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(carritoActualizado)
        
        
} catch (error) {
    console.log(error.message)
}

   
})

router.put('/:cid', (req,res)=>{
    
})

router.delete('/:cid', async (req,res)=>{

    try {
        
    let {cid} = req.params

    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ingrese un ID valido de MongoDB`})
    }

    let vaciarCarrito = await CarritosMongoManager.update(cid, {products:[]}, {new:true})

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).send({payload:`Carrito vaciado con exito`})
        
    } catch (error) {

        console.log(error.message)
        
    }



})

module.exports=router