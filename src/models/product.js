const mongoose = require("mongoose")
const { default: validator } = require("validator")
const { model } = require("./factory")

//Product model - provides an interface to our database MongoDB
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    watt: {
        type: String,
        required: true
    },
    water: {
        type: String,
        required: true
    },
    organic: {
        type: String,
        required: true
    }, 
    factory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Factory"
    },
    supplier: 
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" 
},
    
}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product