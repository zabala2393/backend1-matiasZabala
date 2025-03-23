const socket = io()

socket.on("saludo", () => {
    alert(`Bienvenido al sistema`)
})

socket.on("agregarProducto", agregarProducto => {
    
    alert(`Producto nuevo ${agregarProducto.title} creado con el id ${agregarProducto.id}`)
    window.location.reload()
})

socket.on("quitarProducto", productToDelete => {
    
    alert(`Producto ${productToDelete.title} eliminado de la base de datos exitosamente`)
    window.location.reload()
})

socket.on("errorCarga1", codigoDuplicado=>{

    alert(`Ya existe en la base de datos un producto con codigo ${codigoDuplicado.code}`)
    window.location.reload()
})

socket.on("errorCarga2", productoDuplicado=>{

    alert(`Ya existe un producto con el nombre ${productoDuplicado.title} con ID ${productoDuplicado.id}`)
    window.location.reload()
})