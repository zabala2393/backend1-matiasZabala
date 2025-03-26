const  {Router} = require ("express");
const { ProductosMongoManager } =  require("../dao/ProductosMongoManager.js");
const { isValidObjectId } = require("mongoose");

const router = Router()

router.get('/', async (req,res)=>{
    try {

        let products = await ProductosMongoManager.get()

        res.setHeader("Content-Type", 'application/json')
        res.status(200).json({products})
        
    } catch (error) {

        console.log(`${error.message}`)
        
    }
})

router.get('/:id', async(req,res)=>{

    let {id} = req.params

    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ingrese un id valido de MongoDB`})
    }

    let productById = await ProductosMongoManager.getBy({_id:id})

    try {     

        if(!productById) {

            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send(message=`No existen productos con el id ${id}`)

        }

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(productById)
        
    } catch (error) {
        
    }
})

router.post('/', async (req,res)=>{

    let {title, description, code, price, status, stock, category, thumbnails} = req.body

    if (!title||!code||!price){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Las propiedades title, code y price son requeridas`})
    }

    try {

        let existe = await ProductosMongoManager.getBy({code})

        let productoDuplicado = await ProductosMongoManager.getBy({title})    

        if(productoDuplicado) {        
    
            req.io.emit("errorCarga1", productoDuplicado)
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ payload: `Ya existe en la base de datos un producto con nombre ${productoDuplicado.title}` })
        }
    
        if(existe){

            req.io.emit("errorCarga2", codigoDuplicado)
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error:`Ya existe un producto con el codigo ${code} en la base de datos`})
        }

        let nuevoProducto = await ProductosMongoManager.save({title, description, code, price, status, stock, category, thumbnails})
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({message:`producto generado`, nuevoProducto})
        
    } catch (error) {

        console.log(error.message)
        
    }
})

router.put('/:id', async (req,res)=>{

    let aModificar=req.body
    let {id} = req.params

    let productoDuplicado = await ProductosMongoManager.getBy({title})
    let existe = await ProductosMongoManager.getBy({code})

    if(productoDuplicado) {        

        req.io.emit("errorCarga1", productoDuplicado)
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ payload: `Ya existe en la base de datos un producto con nombre ${productoDuplicado.title}` })
    }

    if(existe){

        req.io.emit("errorCarga2", codigoDuplicado)
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ya existe un producto con el codigo ${code} en la base de datos`})
    }

    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ingrese un id valido de MongoDB`})
    }
    try {

        let productoModificado = await ProductosMongoManager.update(id, aModificar)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({productoModificado})  

    } catch (error) {
        
    }
})

router.delete('/:id', async(req,res)=>{

    let {id} = req.params

    try {

        let productDelete = await ProductosMongoManager.delete(id,{})

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({productDelete}) 
    
        
    } catch (error) {
        console.log(error.message)
    }


})


module.exports = router