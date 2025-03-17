const socket = io()

socket.on("saludo", ()=>{
    alert(`Bienvenido al sistema`)
})

socket.on("agregarProducto", producto=>{

    window.location.reload()
    alert(`Producto nuevo ${producto.title} creado con el id ${producto.id}`)
})