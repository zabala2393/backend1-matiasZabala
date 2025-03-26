const mongoose = require("mongoose")
const paginate = require('mongoose-paginate-v2')

const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: String,
        code: {
            type: String,
            required: true,
            unique: true,
        },
        price: Number,
        status: {
            type: String,
            default: null,           

        },
        stock: {
            type: Number,
            default: 0
        },
        category: String,
        thumbnails: {
            type: Object,
            default: [],
        }
    },
    {
        timestamps: true,
    }
)

const productosModelo = mongoose.model(
    "products",
    productsSchema
)

productsSchema.plugin(paginate)

module.exports = { productosModelo }