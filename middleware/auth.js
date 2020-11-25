//este middleware nos permite verificar si un token es incorrecto o correcto. La autorizacion es que dejemos que un usuario acceda a un recurso en particular


const jwt = require('jsonwebtoken')

function auth(req, res, next){
    const jwtToken = req.header('Autorization')
    if(!jwtToken) return res.status(401).send('Acceso denegado. Necesitamos un token válido')

    try{
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_llavesecreta)
        req.user = payload
        next()
    }catch(e){
        res.status(400).send('Acceso denegado. Token no valido')
    }

}

module.exports = auth