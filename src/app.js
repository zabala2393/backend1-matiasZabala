const express = require("express")
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
const app = express()

let io = undefined

const productsRouter = require('./routes/productsRouter.js')
const cartsRouter = require('./routes/cartsRouter.js')
const viewsRouter = require('./routes/viewsRouter.js')
const { errorhandler } = require("./middlewares/errorHandler")

const PORT = 8080

mongoose.connect('mongodb+srv://gemini2393:520033@e-commerce.dkxb7.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce')
.then(()=>{
    console.log("Conectado a la base de datos de Mongo Atlas")
})
.catch(error=>console.error("La conexion ha fallado"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", (req, res, next)=>{
    req.io=io
    next()
} 
,productsRouter
)
app.use("/api/carts", cartsRouter)
app.use("/", (req,res, next)=>{
    req.io=io
    next()
}, viewsRouter)


const serverHttp = app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

io = new Server(serverHttp)

io.on('saludo', () =>{

    console.log('Bienvenido al sistema')

    socket.emit('saludo')
})

io.on('connection', socket => {

    console.log(`Se ha conectado un usuario con id ${socket.id}`)

    socket.broadcast.emit(`${socket.id} se ha conectado al servidor`)

})

io.on("agregarProducto", producto => {

    console.log(`${producto.title} creado`)
    socket.emit("agregarProducto", producto)

})

io.on("quitarProducto", producto=>{
    socket.emit("quitarProducto", producto)
})

app.use(errorhandler)