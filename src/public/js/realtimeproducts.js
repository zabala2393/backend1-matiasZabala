const socket = io()

socket.on("saludo", () => {
    alert(`Bienvenido al sistema`)
})

socket.on("agregarProducto", agregarProducto => {
    
    alert(`Producto nuevo ${agregarProducto.title} creado con el id ${agregarProducto._id}`)
    window.location.reload()
})

socket.on("quitarProducto", productById => {
    
    alert(`Producto ${productById.title} eliminado de la base de datos exitosamente`)
    window.location.reload()
})

socket.on("errorCarga2", codigoDuplicado=>{

    alert(`Ya existe un producto con el codigo ${codigoDuplicado.code} con ID ${codigoDuplicado._id}`)

})

socket.on("borrarProducto",actualizarCarrito=>{
    window.location.reload()
    alert(`Se ha eliminado el producto del carrito!`)

} )

socket.on("rutaErronea", cid=>{
    alert(`No existe ningun carrito con el id ${cid}`)
})

socket.on("idErroneo", ()=>{
    alert(`El id ingresado no es valido`)
})