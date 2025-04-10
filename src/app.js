const express = require("express")
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
const app = express()
const { config } = require('./config/config.js')

let io = undefined

const database = require('./config/db.js')
const productsMongoRouter = require('./routes/productosMongoRouter.js')
const cartsMongoRouter = require('./routes/cartsMongoRouter.js')
const viewsRouter = require('./routes/viewsRouter.js')
const { errorhandler } = require("./middlewares/errorHandler")

const db = database.conectarDB(config.MONGO_URL, config.DB_NAME)

const PORT = config.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public', productsMongoRouter))
app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", (req,res,next)=>{
    req.io=io,
    req.db=db
    next()
},
productsMongoRouter)
app.use("/api/carts", (req,res,next)=>{
    req.io=io,
    next()
}, cartsMongoRouter)
app.use("/", (req, res, next) => {
    req.io = io
    next()
}, viewsRouter)


const serverHttp = app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

io = new Server(serverHttp)

io.on('saludo', saludo => {

    console.log('Bienvenido al sistema')

    socket.emit('saludo', saludo)
})

io.on('connection', socket => {

    console.log(`Se ha conectado un usuario con id ${socket.id}`)

    socket.broadcast.emit(`${socket.id} se ha conectado al servidor`)

})

io.on("agregarProducto", producto => {

    console.log(`${producto.title} creado`)
    socket.emit("agregarProducto", producto)

})

io.on("quitarProducto", producto => {
    socket.emit("quitarProducto", producto)
})

app.use(errorhandler)