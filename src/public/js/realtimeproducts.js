const socket = io()

socket.on("saludo", ()=>{
    socket.emit("saludo", `Usuario nuevo se ha conectado`)
})

socket.on("agregarProducto", producto=>{
    socket.emit("agregarProducto", `Producto nuevo creado con el id ${producto.id}`)
})

