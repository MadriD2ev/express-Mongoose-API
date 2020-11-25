function autorize(roles = []){
    if(typeof roles === 'string'){
        roles = [roles]
    }

    return [
        (req, res, next) => {
            if(!roles.includes(req.user.role)) return  res.status(403).send('El rol no es el permitido para acceder a este recurso')
            next()
        }
    ]
}

module.exports = autorize