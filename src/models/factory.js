const mongoose = require("mongoose")
const { default: validator } = require("validator")
const { model } = require("./user")

//Factory model - provides an interface to our database MongoDB
const factorySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    greenEnergy: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, 
    supplier: 
        { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" 
    },
    product: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ]
    
}, {
    timestamps: true
})

const Factory = mongoose.model("Factory", factorySchema)
module.exports = Factory