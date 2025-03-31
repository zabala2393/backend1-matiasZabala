const mongoose = require("mongoose")
const paginate = require('mongoose-paginate-v2')

const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index:true
        },
        description: String,
        code: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type:Number,
            index: true,
        },
        status: {
            type: Boolean,
            default: false,       

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


const paginar = productsSchema.plugin(paginate)

const productosModelo = mongoose.model('products', productsSchema)

module.exports = {productosModelo}

