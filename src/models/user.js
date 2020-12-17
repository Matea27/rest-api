const mongoose = require("mongoose")
const { default: validator } = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Factory = require("./factory")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true //adding 2 new fields: createdAt and updatedAt
})
//toJSON - expose only the properties you want to expose in the response
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "thisismycourse")

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}
//virutal property
userSchema.virtual("factories", {
    ref: "Factory",
    localField: "_id", // factory has supplier id and its associated here: users id
    foreignField:"supplier"  //name of the field of the factory
})
userSchema.virtual("products", {
    ref: "Product",
    localField: "_id", // factory has supplier id and its associated here: users id
    foreignField:"supplier"  //name of the field of the factory
})
//Hash the plain text password before saving
//error fucntions doesn´t bind this, thats why we are using function()
userSchema.pre("save", async function(next) {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()

})
//Delete user companies when user is removed
userSchema.pre("remove", async function(next){
    const user = this
    await Factory.deleteMany({suplier: user._id})
    next()
})

//User model - provides an interface to our database MongoDB
const User = mongoose.model("User", userSchema)
module.exports = User