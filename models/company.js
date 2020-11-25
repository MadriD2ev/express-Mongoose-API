const mongoose = require('mongoose')

const companySchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        minlength: 1,
        maxlength: 99
    },
    country: String,
    date:{type: Date, default: Date.now}
})

const Company = mongoose.model('company', companySchema)

//module.exports = Company

//Paso 1 para el modelo de datos embebido
module.exports.Company = Company
module.exports.companySchema = companySchema