const express = require("express")
const cors = require("cors")
require("./db/mongoose")
const factoryRouter = require("./routers/factory")
const userRouter = require("./routers/user")
const productRouter = require("./routers/product")

const app = express()
const port = 3000


// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Try again soon!")
// })

app.use(cors())
// configuring express.json to automatically parse incoming JSON into a JavaScript object which we access on req.body
app.use(express.json())
app.use(userRouter)
app.use(factoryRouter)
app.use(productRouter)

app.listen(port, ()=> {
    console.log("Server is up on port " + port)
})


