import { carritoModelo } from "./models/carritoModelo.js";

export class CarritosMongoManager{

    static async get(){
        return await carritoModelo.find().lean()
    }

    static async getBy(filtro={}){
        return await carritoModelo.findOne(filtro)
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
}