const fs = require('fs');

class ProductManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {

            let products = JSON.stringify(await fs.promises.readFile(this.path, 'utf-8',(error, datoLeido)=>{
                if(error){ console.log(`${error.message}`)
                return}
                console.log(datoLeido)
            }))
            
            return [products]
        } else {
            return ([])
        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnails=[]) {
        let products = await this.getProducts()

        let id = 1

        if (products.length > 0) {
            id = id++
        }

        let producto = {
            id, title:(''), description:(''),code:(''), price, status, stock:(''), category:(''), thumbnails:[('')]
        }     

        if (products.find(prod=>prod.id == producto.id)){

        products.push(producto)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return producto
    } else {
            return console.log(`Este producto con el ID ${producto.id} ya existe`)
        }
    }
}
module.exports = { ProductManager}