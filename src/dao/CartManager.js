const fs = require('fs')

class CartManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo
    }

    async getOrdenes() {

        if (fs.existsSync(this.path)) {

            let ordenes = JSON.stringify(await fs.promises.readFile(this.path, 'utf-8'))
            return [ordenes]
        }

    }

    async createCart(products = []) {

        let id = 1

        let carrito = { id, products }

        let ordenes = [...carrito]

        if (ordenes.length > 0) {
            id = id++
        }    

        ordenes.push(carrito)
        await fs.promises.writeFile(this.path, JSON.stringify(ordenes, null, 5))
        return ordenes
    }
}

module.exports = {CartManager}