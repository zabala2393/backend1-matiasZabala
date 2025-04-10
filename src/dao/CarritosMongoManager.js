import { carritoModelo } from "./models/carritoModelo.js";

export class CarritosMongoManager{

    static async get(){
        return await carritoModelo.find().lean().populate("products.product", 'title description code price status stock category thumbnails' )
    }

    static async getBy(filtro={}){
        return await carritoModelo.findOne(filtro).lean().populate("products.product", 'title description code price status stock category thumbnails' )
    }

    static async filter(filtro={}){
        return await carritoModelo.exists(filtro).lean()
    }

    static async save(cart){
        let nuevoCarrito= await carritoModelo.create(cart)
        return nuevoCarrito.toJSON()
    }

    static async update(id, aModificar={}){ 
        return await carritoModelo.findByIdAndUpdate(id, aModificar, {new:true, runValidators:true}).lean()
    }

    static async delete(id){
        return await carritoModelo.findByIdAndDelete(id, {}). lean()
    }

    static async exists(id){
        return await carritoModelo.exists(id)
    }
}