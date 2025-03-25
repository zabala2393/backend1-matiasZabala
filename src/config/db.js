import mongoose from "mongoose";

export const conectarDB = async (uriMongoDB, dbName)=>{
    try {
        await mongoose.connect(uriMongoDB,{dbName: dbName})
        console.log("Conectado correctamente a base de datos MongoDB")
        
    } catch (error) {
        console.log(`Error al conectar a base de datos ${error.message}`)
    }
}

