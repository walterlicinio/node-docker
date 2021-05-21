const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const redis = require('redis')

const app = express()
const port = process.env.PORT || 3000;
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

let RedisStore = require('connect-redis')(session)
let RedisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
})





//Routers
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const connectWithRetry = () => {
  mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
    .then(() => console.log("Successfully connected to Database"))
    .catch((e) => {
      (console.log(e))
      setTimeout(connectWithRetry, 5000)
    }
    )
}

connectWithRetry()

app.use(session({
  store: new RedisStore({client: RedisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge:30000
  }
}))
app.use(express.json())


app.get('/', (req, res) => {
  res.send("<h1>Hi there!!<h1>")
})

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))



