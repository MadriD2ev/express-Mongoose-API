const mongoose = require('mongoose')
const express = require('express')
const app = express()
const car = require('./routes/car')
const user = require('./routes/user')
const company = require('./routes/company')
const sale = require('./routes/sale')
const auth = require('./routes/auth')
const port = 3000 || process.env.PORT

app.use(express.json())
app.use('/api/cars/', car)
app.use('/api/user/', user)
app.use('/api/company/', company)
app.use('/api/sale/', sale)
app.use('/api/auth/', auth)

app.listen(port, () => {
    console.log(`Escuchando en el puerto http://localhost:${port}`)
})

//console.log(process.env.SECRET_KEY_JWT_llavesecreta) //------> palabra secreta del JWT

mongoose.connect('mongodb://localhost/carsdb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(()=>console.log("Conectado correctamente a MongoDB"))
    .catch(()=>console.log("Error al conectarse a MongoDB"))


