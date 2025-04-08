const  {Router} = require ("express");
const { ProductosMongoManager } =  require("../dao/ProductosMongoManager.js");
const { isValidObjectId } = require("mongoose");

const router = Router()

router.get('/', async (req,res)=>{
   
    try {

        let products= await ProductosMongoManager.get()
        res.setHeader("Content-Type", 'application/json')
        res.status(200).json({products})
        
    } catch (error) {

        console.log(`${error.message}`)
        
    }
})

router.get('/:id', async(req,res)=>{

    try {     

        let {id} = req.params

        if(!isValidObjectId(id)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error:`Ingrese un id valido de MongoDB`})
        }
    
        let productById = await ProductosMongoManager.getBy({_id:id})

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

    if (!title||!code||!price||!status||!stock||!description||!category||!thumbnails){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Todas las propiedades son requeridas`})
    }

    try {

        let existe = await ProductosMongoManager.getBy({code})
    
        if(existe){

            req.io.emit("errorCarga2", existe)
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error:`Ya existe un producto con el codigo ${code} en la base de datos`})
        }

        let nuevoProducto = await ProductosMongoManager.save({title, description, code, price, status, stock, category, thumbnails})
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({message:`producto generado`, nuevoProducto})
        
    } catch (error) {

        console.log(error.message)
        res.status(400).send(error.message)
        
    }
})

router.put('/:id', async (req,res)=>{

    try {

    let aModificar = req.body
    let {id} = req.params

    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ingrese un ID valido de MongoDB`})
    }

    let buscarProducto = await ProductosMongoManager.getBy({_id:id})

    console.log(buscarProducto)
    
    let existe = await ProductosMongoManager.getBy({code:aModificar.code})

    if(!buscarProducto) {        

        req.io.emit("errorCarga1", buscarProducto)
        res.setHeader('Content-Type', 'application/json')
        return res.status(404).json({ payload: `No existe ningun producto con ID ${id} en la base de datos` })
    }

    if(existe){

        req.io.emit("errorCarga2", existe)
        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({error:`Ya existe un producto con el codigo ${aModificar.code} en la base de datos`})

    }
        let productoModificado = await ProductosMongoManager.update(id, aModificar)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({productoModificado})  

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Error de servidor, intente de nuevo")
    }
})

router.delete('/:id', async(req,res)=>{

    let {id} = req.params
    
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Ingrese un id valido de MongoDB`})
    }

    let existe = await ProductosMongoManager.getBy({_id:id})

    if(!existe) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(404).json({error:`No existe ningun producto con id ${id} en la base de datos`})

    }

    try {

        let productDelete = await ProductosMongoManager.delete(id,{})        

        res.setHeader('Content-Type', 'application/json')

        req.io.emit("quitarProducto", productDelete)

        return res.status(200).json(`${productDelete.title} eliminado de la base de datos`) 
    
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error:`Error interno de servidor, intente de nuevo mas tarde`})
    }
})

module.exports = router