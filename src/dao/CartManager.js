const fs = require('fs')

class CartManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo
    }

    async getOrdenes() {

        if (fs.existsSync(this.path)) {

            let ordenes = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return ordenes
        }

    }

    async createCart(products = []) {

        let cid = 1

        let carrito = { cid, products }

        let ordenes = [...carrito]

        if (ordenes.length > 0) {
            cid = cid++
        }    

        ordenes.push(carrito)
        await fs.promises.writeFile(this.path, JSON.stringify(ordenes, null, 5))
        return ordenes
    }
}

module.exports = {CartManager}