const Router = require('express').Router

const router = Router()

router.get('/', async(req,res)=>{

    let products = await pm.getProducts(this.path)
    res.status(200).json(products)
    
})

router.get("/:id", async (req, res) => {

    let { id } = req.params

    let products = await pm.getProducts(this.path)

    let productById = products.find(p => p.id == id)

    if (!productById) {
        res.status(404).send(`El producto con el ID ${id} no existe`)
    } else {
        res.status(200).json(productById)
    }
})

router.post("/", async (req, res) => {

    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    let products = await pm.getProducts(this.path)

    let agregarProducto = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)

    let productoDuplicado = products.find(p => p.code.toLowerCase() == code.toLowerCase())

    if (!productoDuplicado) {

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: `${title} agregado correctamente con el codigo ${code}` })

    } else {

        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ payload: `Este producto ya existe en la base de datos` })
    }
}
)

router.delete("/:id", async (req, res) => {

    let { id } = req.params

    let products = await pm.getProducts(this.path)

    let productById = products.find(p => p.id == id)

    if (!productById) {

        res.setHeader('Content-Type', 'application/json')
        res.status(404).send(`Producto con ID ${id} no existe en la base de datos`)

    } else {

        let deleteProduct = await pm.deleteProduct(productById.id)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(` El producto ha sido eliminado correctamente de la base de datos`)

    }
})

router.put("/:pid", async (req, res) => {

    let { pid } = req.params 

    let { title, description, code, price, status, category, stock, thumbnails } = req.body

    let products = await pm.getProducts()

    let productoOriginal = products.find(p => p.id == pid)

    let indiceProducto = products.indexOf(productoOriginal) 

    if (indiceProducto <= -1) {

        return res.status(404).send(`No existe un producto con el ID ${pid}`)

    }

    let id = pid

    let aModificar = {title, description, price, stock}

    if (title && description && price && stock) {

    let modificarProducto = await pm.changeProduct(pid, aModificar)

} else {

    return res.status(400).send(`Faltan propiedades a modificar! Ingrese title, description, price y stock`)
}

    if (aModificar) {

        return res.status(200).send(`Producto ${productoOriginal.title} modificado con exito`)
    
        
    }
}
)

module.exports=router