const mongoose =  require("mongoose")

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
        status: String,
        stock: {
            type: Number,
            default: 0
        },
        category: String,
        thumbnails: {
            type:Object,
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

module.exports={productosModelo}