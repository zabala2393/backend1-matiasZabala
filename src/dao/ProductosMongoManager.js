import { productosModelo } from "./models/productosModelo.js";

export class ProductosMongoManager {
    static async get(page = 1, limit = 4, sort = "asc", query = {}) {

        try {
            let options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: sort === "asc" ? 1 : -1 },
                lean: true
            };

            return await productosModelo.paginate(query, options)
        } catch {
            console.log(error.message)
            throw error
        }
    }

    static async getBy(filtro = {}) {
        return await productosModelo.findOne(filtro).lean()
    }

    static async getById(id) {
        return await productosModelo.getById(id).lean
    }

    static async save(product) {
        let nuevoProducto = await productosModelo.create(product)
        return nuevoProducto.toJSON()
    }

    static async update(id, aModificar = {}) {
        return await productosModelo.findByIdAndUpdate(id, aModificar, { new: true }).lean()
    }

    static async delete(id) {
        return await productosModelo.findByIdAndDelete(id, {}).lean()
    }


}