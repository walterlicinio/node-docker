const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000;
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

//Routers
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const connectWithRetry = () => {
  mongoose.connect(mongoURL, {useNewUrlParser:true, useUnifiedTopology:true,useFindAndModify:true})
  .then(()=>console.log("Successfully connected to Database"))
  .catch((e)=>{
    (console.log(e))
    setTimeout(connectWithRetry, 5000)
    }
  )
 }

connectWithRetry()
app.use(express.json())


app.get('/', (req,res)=>{
res.send("<h1>Hi there!!<h1>")
})

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

app.listen(port, ()=>console.log(`Listening on port ${port}`))



