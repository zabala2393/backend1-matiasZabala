const socket = io()

socket.on("saludo", ()=>{
    alert(`Bienvenido al sistema`)
})

socket.on("agregarProducto", agregarProducto=>{
    window.location.reload()
    alert(`Producto nuevo ${agregarProducto.title} creado con el id ${agregarProducto.id}`)
})

socket.on("quitarProducto", productById=>{
    window.location.reload()
    alert(`Producto ${productById.title} elimina de la base de datos exitosamente`)
})

let botonQuitar = document.querySelectorAll("quitarProducto")
let formInfo = document.getElementById("nuevoProducto")
let formInputs = document.querySelectorAll("input")

formInfo.addEventListener("submit", async (e)=>{

    console.log(formInfo)
    e.preventDefault();
    onclick = await pm.addProduct(input.title, input.description, input.code, input.price, input.status, input.stock, input.category, input.thumbnails)
})