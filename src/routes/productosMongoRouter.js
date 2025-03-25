const  {Router, application} = require ("express");
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

router.post('/', async (req,res)=>{
    let {title, description, code, price, status, stock, category, thumbnails} = req.body
    if (!title||!code||!price){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Las propiedades title, code y price son requeridas`})
    }

    try {

        let existe = await ProductosMongoManager.getBy({code})
    
        if(existe){
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error:`Ya existe un producto con el codigo ${code} en la base de datos`})
        }

        let nuevoProducto=await ProductosMongoManager.save({title, description, code, price, status, stock, category, thumbnails})
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({message:`producto generado`, nuevoProducto})
        
    } catch (error) {

        console.log(error.message)
        
    }
})

router.put('/:id', async (req,res)=>{

    let aModificar=req.body
    let {id} = req.params

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

})



module.exports = router