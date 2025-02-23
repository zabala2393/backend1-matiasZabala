const fs = require('fs');
const { isNumberObject } = require('util/types');

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

    async addProduct(title='', description='', code, price, status, stock, category='', thumbnails = []) {

        let products = await this.getProducts(this.path)    

        let id = 1

        if (products.length > 0) {
            id = id++
        }

        let producto = {
            id, title, description, code, price, status, stock, category, thumbnails
        }

        let productoExiste = products.find(prod => prod.id == producto.id)

        if(!productoExiste) {

            products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return producto
        } else {
            return `El producto ${producto.title} ya existe con el id ${producto.id}`
        }        
    }
}
module.exports = { ProductManager }