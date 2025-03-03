const fs = require('fs')
const { ProductManager } = require('./ProductManager')
const pm = new ProductManager

class CartManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo
    }

    async getOrdenes() {

        if (fs.existsSync(this.path)) {

            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

        } else {

            return []

        }

    }

    async addToCart(carritoObjetivo, productoObjetivo) {
     
        if (carritoObjetivo && productoObjetivo) {

            let carritoProducts = carritoObjetivo.products

            carritoProducts.push(productoObjetivo)
            await fs.promises.writeFile(this.path, JSON.stringify(carritoProducts, null, 5 ))
            return carritoObjetivo.products
    
        } else if (!productoObjetivo || !carritoObjetivo) {
    
            return (`El carrito/producto no existe. Por favor revise los datos`)
    
        }

    }

    async createCart(products = []) {

        let ordenes = await this.getOrdenes(this.path)

        let cid = 1

        if (ordenes.length > 0) {
            cid = Math.max(...ordenes.map(d=>d.cid))+1
        }

        let carrito = { cid, products }

        ordenes.push(carrito)
        await fs.promises.writeFile(this.path, JSON.stringify(ordenes, null, 5))
        return ordenes
    }
}

module.exports = {CartManager}