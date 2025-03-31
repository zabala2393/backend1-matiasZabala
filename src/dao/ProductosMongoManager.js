import { productosModelo } from "./models/productosModelo.js";

export class ProductosMongoManager{
    static async get(page=1, limit=4){
        return await productosModelo.paginate({}, {page, limit, lean:true})
    }

    static async getBy(filtro={}){
        return await productosModelo.findOne(filtro).lean()
    }

    static async getById(id){
        return await productosModelo.getById(id).lean
    }

    static async save(product){
        let nuevoProducto = await productosModelo.create(product)
        return nuevoProducto.toJSON()
    }

    static async update(id, aModificar={}){
        return await productosModelo.findByIdAndUpdate(id, aModificar, {new:true}).lean()
    }

    static async delete(id){
        return await productosModelo.findByIdAndDelete(id, {}).lean()
    }


}