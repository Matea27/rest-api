const express = require("express")
const Product = require("../models/product")
const auth = require("../middleware/auth")
const Factory = require("../models/factory")
const router = new express.Router()

router.get("/products", async (req,res) => {
    try{
        const products = await Product.find({})
        res.send(products)
    } catch(e){
        res.status(500).send()
    }
})

router.get("/products/:id", async (req,res)=> {
    const _id = req.params.id

    try{
        const product = await Product.findById(_id)
        if(!product){
            return res.status(404).send()
        }
        res.send(product)
    } catch(e){
        res.status(500).send()
    }
}) 

router.post("/:factoryId/products",auth, async (req,res)=> {
    const {factoryId} = req.params
    const newProduct = new Product({
        ...req.body,
        supplier: req.user._id
    })
    const matchFactory = await Factory.findById(factoryId)
    newProduct.factory = matchFactory
     try{
         await newProduct.save()
         res.status(201).send(newProduct)
         matchFactory.owner.push(newProduct)
         await matchFactory.save()
         
     } catch(e){
         res.status(500).send()
     }
     
 })

router.patch("/products/:id",auth, async (req,res) =>  {
    const updates = Object.keys(req.body) 
        const allowedUpdates = ["name", "color", "price","water","watt","factory"] 
        const isValidOperation = updates.every((update)=> {
           return allowedUpdates.includes(update)
        })
    
        if (!isValidOperation) {
            return res.status(400).send({error: "Invalid updates"}) 
        }
        try {
            const product = await Product.findOne({ _id: req.params.id, supplier: req.user._id})
            
            if(!product){
                return res.status(404).send()
            }
            updates.forEach((update)=> {
                product[update] = req.body[update]  //accessing property dynamically 
            })
            await product.save()
            res.send(product)
        } catch(e){
            res.status(500).send(e)
        }
})

router.delete("/products/:id",auth, async (req,res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, supplier: req.user._id})
        if (!product){
            return res.status(404).send()
        }
        res.send(product)
    } catch(e) {
        res.status(500).send()
    }
})

router.delete("/products", async (req,res) => {
    try {
        const products = await Product.deleteMany({})
        res.send(products)
    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router