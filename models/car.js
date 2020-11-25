const mongoose = require('mongoose')
//paso 1 para el modelo de datos embebido
const {companySchema} = require('./company')

//crear Schema
const carSchema = new mongoose.Schema({
    company:{
        //Paso 1 para que el modelo sea embebido dentro de la BD
        type: companySchema,
        required:true
        /*
        //Paso:1 para lograr que sean datos normalizados en bd, solo se guarda el id del objeto nuevo que se crea y a partir de ese obtener su info. esto consume más recursos 
        type: mongoose.Schema.Types.ObjectId,
        //nombre de la coleccion
        ref:'company'
        /*
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 99,
        enum: ['BMW', 'AUDI', 'SEAT']
        */
       
    },
    model: String,
    sold: Boolean,
    price: {
        type: Number,
        required: function(){
            return this.sold
        }
    },
    year:{
        type: Number,
        min: 2000,
        max: 2030
    },
    extras: [String],
    date: {type:Date, default:Date.now}
})

//crear modelo
const Car = mongoose.model('car', carSchema)

//exportar el modelo
module.exports = Car