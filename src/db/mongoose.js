const mongoose = require("mongoose")

//connection to database
mongoose.connect("mongodb://127.0.0.1:27017/company-project-api",{
    //Following options object are fixing the deprication warning
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, 
    useUnifiedTopology: true 
})
