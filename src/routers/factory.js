const express = require("express")
const Factory = require("../models/factory")
const auth = require("../middleware/auth")
const router = new express.Router()

router.get("/factories", auth, async (req,res) => {
    const match = {}
    try {
        await req.user.populate({
            path: "factories",
            match
        }).execPopulate()
        res.send(req.user.factories)
    } catch(e){
        res.status(500).send()
    }
})
//Filtering ther data
//without middleware auth, there is a public acess
router.get("/factories/:id", async (req,res) => {
    const _id = req.params.id
    try {
        const factory = await Factory.findOne({ _id })
        if (!factory){
            return res.status(404).send()
        }
        res.send(factory)
    } catch(e){
        res.status(500).send()
    }
})

router.post("/factories",auth, async (req,res)=> { 
    const factory = new Factory({
        ...req.body,
        supplier: req.user._id
    })
    try{
        await factory.save()
        res.status(201).send(factory)
    } catch(e){
        res.status(400).send(e)
    }
})

router.patch("/factories/:id",auth, async (req,res)=> {
        const updates = Object.keys(req.body) 
        const allowedUpdates = ["country", "city", "description","greenEnergy","website","supplier"] 
        const isValidOperation = updates.every((update)=> {
           return allowedUpdates.includes(update)
        })
    
        if (!isValidOperation) {
            return res.status(400).send({error: "Invalid updates"}) 
        }
        try {
            const factory = await Factory.findOne({ _id: req.params.id, supplier: req.user._id})
            
            if(!factory){
                return res.status(404).send()
            }
            updates.forEach((update)=> {
                factory[update] = req.body[update]  //accessing property dynamically 
            })
            await factory.save()
            res.send(factory)
        } catch(e){
            res.status(500).send(e)
        }
})

router.delete("/factories/:id",auth, async (req,res) => {
    try {
        const factory = await Factory.findOneAndDelete({ _id: req.params.id, supplier: req.user._id})
        if (!factory){
            return res.status(404).send()
        }
        res.send(factory)
    } catch(e) {
        res.status(500).send()
    }
})

router.delete("/factories", async (req,res) => {
    try {
        const factories = await Factory.deleteMany({})
        res.send(factories)
    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router