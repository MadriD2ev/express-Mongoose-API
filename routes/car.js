const mongoose = require('mongoose')
const express = require('express')
//para validaciones de datos
const { body, validationResult } = require('express-validator');

//importar modelo 
const Car = require('../models/car')

//permitir diferentes acciones de acuerdo a su rol
const Role = require('../helpers/role')
const autorize = require('../middleware/role')
const auth = require('../middleware/auth')

//paso 1 para modelo de datos embedido
const {Company} = require('../models/company')

//refactorizando código
const router = express.Router()





//metodo get 
router.get('/', [auth,autorize([Role.Admin])],async(req,res)=> {
     //nos devuelve todos los elementos de la bd
     const cars = await Car
        .find()
        //populate, entra a la bd y te trae la informacion del objeto por el id que company que trae, este paso es el 1 del modelo de datos normalizado
        //.populate('company', 'name country')
     res.send(cars)
})

router.get('/:id', async(req,res)=> {
    //nos devuelve todos los elementos de la bd
    const car = await Car.findById(req.params.id)
    if(!car) return res.status(404).send('No hemos encontrado un coche con ese ID')
    res.send(car)
})

//POST para el modelo datos embebido
router.post('/',[
    //si esta vacio
    body('year').isLength({ min: 2 }),
    // password must be at least 3 chars long
    body('model').isLength({ min: 2 })
], async(req,res)=> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //buscar por id para poder guardar
    const company = await Company.findById(req.body.companyId)
    //sino tenemos ese fabricante en la base de datos 
    if(!company) return res.status(400).send('No tenemos ese fabricante')

    const car = new Car({
        company: company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })

    const result = await car.save()
    res.status(201).send(result)
})

/*POST para el modelo de datos normalizado
//utilizacion del validator
router.post('/',[
    //si esta vacio, ya no se ocupará por el paso 1 para normalizar
    //body('company').isLength({ min: 2 }),
    // password must be at least 3 chars long
    body('model').isLength({ min: 2 })
], async(req,res)=> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })

    const result = await car.save()

    res.status(201).send(result)
})
*/

//creación de un put
router.put('/:id',[
    //si esta vacio, ya no se ocupará por el paso 1 para normalizar
    //body('company').isLength({ min: 2 }),
    // password must be at least 3 chars long
    body('model').isLength({ min: 2 })
], async(req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const car = await  Car.findByIdAndUpdate(req.params.id, {
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    }, 
    {
        //nos devuelve el documento actualizado
        new: true
    } )

    if(!car){
        return res.status(404).send('El coche con ese id no esta en la bd')
    }

    res.status(204).send('El registro se ha actualizado')
})

router.delete('/:id', async(req, res)=>{

    const car = await Car.findByIdAndDelete(req.params.id)

    if(!car){
        return res.status(404).send('El coche con ese id no esta en la bd, no se puede borrar')
    }

    res.status(200).send('coche borrado')
})

module.exports = router