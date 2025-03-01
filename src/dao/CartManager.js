const fs = require('fs')

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

    async addToCart(product, quantity) {

        let ordenes = await this.getOrdenes(this.path)

        let products = await this.getProducts(this.path)

        





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