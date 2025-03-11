const log=(req,res,next)=>{
    
    next()
}

const errorhandler=(error, req,res,next)=>{

    console.log(`Error: ${error.message}`)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(

        {
            error: `Error inesperado en el servidor - Intente mas tarde o contacte a su proovedor`,
            detalle: `${error.messagee}`
        }
    )
}

module.exports={log, errorhandler}