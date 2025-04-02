import { carritoModelo } from "./models/carritoModelo.js";

export class CarritosMongoManager{

    static async get(){
        return await carritoModelo.find().lean()
    }

    static async getBy(filtro={}){
        return await carritoModelo.findOne(filtro).lean().populate("products.product", 'title description code price status stock thumbnails' ).sort(["asc", "desc"]['price'])
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