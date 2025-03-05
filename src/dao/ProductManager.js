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

        let productById = products.find(p => p.id == id)

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
            id = Math.max(...products.map(d => d.id)) + 1
        }

        let producto = {
            id, title, description, code, price, status, stock, category, thumbnails
        }

        let productoExiste = products.find(p => p.title == producto.title)

        if (!productoExiste) {

            products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return producto

        } else {

            return `El producto ${productoExiste.title} ya existe con el id ${productoExiste.id}`
        }
    }

    async changeProduct(id, aModificar) {

        let products = await this.getProducts(this.path)

        let objetoModelo = products[0]

        let propiedadesCorrectas = Object.keys(objetoModelo)

        let propModificadas = Object.keys(aModificar)

        let indiceProducto = products.findIndex(p=>p.id==id)

        if (!propModificadas.every(p => propiedadesCorrectas.includes(p))) {

            console.log(`Error en las propiedas enviadas. Propiedades validas: ${JSON.stringify(propiedadesCorrectas)}`)
            return

        }

        if (aModificar.title) {
            let yaExiste = products.find(p => p.title === aModificar.title && p.id != id)
            if (yaExiste) {

                console.log(`ya existe un producto con title ${aModificar.title}, y con id diferente a ${id}: ${JSON.stringify(yaExiste)}`)
                return

            } else {

                let sinCambios = products[indiceProducto]
                products[indiceProducto] = {
                    ...products[indiceProducto],
                    ...aModificar                    
                }

                console.log(sinCambios)
                console.log(products[indiceProducto])
                
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
                return 
            }
        }
    }
}

module.exports = { ProductManager }