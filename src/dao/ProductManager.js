const fs = require('fs');

class ProductManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {  
       
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
        } else {

            return []  

        }
    }

    async deleteProduct(id) {

        let products = await this.getProducts(this.path)

        let productById = products.find(p=>p.id == id)

        let productToDelete = products.indexOf(productById)

        if (!productById) {         

            return (`El producto con ID ${id} no existe en la base de datos`)

        } else {

            products.splice(productToDelete, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return productToDelete          

        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnails = []) {

        let products = await this.getProducts(this.path)    

        let id = 1

        if (products.length > 0) {
            id = Math.max(...products.map(d=>d.id))+1
        }

        let producto = {
            id, title, description, code, price, status, stock, category, thumbnails
        }

        let productoExiste = products.find(p => p.title == producto.title)

        if(!productoExiste) {

            products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return producto

        } else {

            return `El producto ${productoExiste.title} ya existe con el id ${productoExiste.id}`
        }        
    }

    async changeProduct(title, description, code, price, status, stock, category, thumbnails) {

        let products = await this.getProducts(this.path)
        
        let productoOriginal = products.find(p=>p.title == title)

        let productoModificado = {title, description, code, price, status, category, stock, thumbnails}

        if(productoOriginal) {
            await fs.promises.writeFile(this.path, JSON.stringify(products.indexOf(productoModificado), null, 5))
            return productoModificado
        } else {

            res.status(200).send(`El producto ${title} no existe en la base de datos`)

        }

    }
}
module.exports = { ProductManager }