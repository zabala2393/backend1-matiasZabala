const socket = io()

let productitem = document.getElementById('productItem')
let botonEliminar = document.getElementsByClassName('botonEliminar')

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

socket.on("errorCarga1", productoDuplicado=>{

    alert(`Ya existe en la base de datos un producto con nombre ${productoDuplicado.title}`)

})

socket.on("errorCarga2", codigoDuplicado=>{

    alert(`Ya existe un producto con el codigo ${codigoDuplicado.code} con ID ${codigoDuplicado._id}`)

})