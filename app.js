const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000;
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
.then(()=>console.log("Successfully connected to Database"))
.catch((e)=>(console.log(e)))

app.get('/', (req,res)=>{
res.send("<h1>Hi there!!<h1>")
})

app.listen(port, ()=>console.log(`Listening on port ${port}`))



