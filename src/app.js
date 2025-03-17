const express = require("express")
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
const path = require('path')
const app = express()
let io = undefined

const productsRouter = require('./routes/productsRouter.js')
const cartsRouter = require('./routes/cartsRouter.js')
const viewsRouter = require('./routes/viewsRouter.js')
const { errorhandler } = require("./middlewares/errorHandler")

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, '/views'))

app.use("/api/products", (req, res, next)=>{
    req.io=io
    next()
} 
,productsRouter
)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)


const serverHttp = app.listen(PORT, () => {

    console.log(`Servidor listo en puerto ${PORT}`)

})

io = new Server(serverHttp)

app.get('/', (req, res) => {

    res.send('Bienvenidos!!')

})

io.on('connection', socket => {

    console.log(`Se ha conectado un usuario con id ${socket.id}`)
    socket.emit("saludo", "mensaje")

    socket.broadcast.emit(`${socket.id} se ha conectado al servidor`)

})

io.on("agregarProducto", producto => {

    console.log(`${producto.title} creado`)
    socket.emit("agregarProducto", `Producto nuevo creado con el ID ${producto.id}`)

})



app.use(errorhandler)