const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require("cors");
const userRouter = require('./Routers/userRouter')
const planRouter = require('./Routers/planRouter')
const subscribeRouter = require('./Routers/subscribeRouter')

const dotenv  = require('dotenv')

const app = express()
app.set('trust proxy', true)
app.use(cors());

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace('<password>',process.env.PASSWORD)

const connectionParam = {
    useNewUrlParser:true,
    useUnifiedTopology:true
}
mongoose.connect(DB,connectionParam).then(con=>{
    console.log('DB CONNECTION SUCCESS')
}).catch(err=>{
    console.log(err)
})

const PORT = process.env.PORT||8000

app.use(morgan('dev'))
app.use(express.json())
app.listen(PORT,()=>{
    console.log("Listening on Port 8000")
})

app.use('/api/user',userRouter)
app.use('/api/plan',planRouter)
app.use('/api/subscribe',subscribeRouter)
