const mongoose = require('mongoose')

const cartsSchema = new mongoose.Schema(    
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: "products",
                        default:[],
                    },
                    quantity: Number
                }
            ]
        }
    }
)

const carritoModelo = mongoose.model(
    "carts",
    cartsSchema
)

module.exports = { carritoModelo }