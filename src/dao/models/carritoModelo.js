const mongoose = require('mongoose')

const cartsSchema = new mongoose.Schema(
    {
        products: [{
            type:Object,
            default: [],

            quantity:Number,

        }
    ],

    }
)

const carritoModelo = mongoose.model(
    "carts",
    cartsSchema
)

module.exports={carritoModelo}