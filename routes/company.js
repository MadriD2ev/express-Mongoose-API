const mongoose = require('mongoose')
const express = require('express')

//importar modelo 
//const Company = require('../models/company')

//paso 1 para modelo de datos embebido
const {Company} = require('../models/company')

//refactorizando código
const router = express.Router()





//metodo get 
router.get('/', async(req,res)=> {
     //nos devuelve todos los elementos de la bd
     const companys = await Company.find()
     res.send(companys)
})

router.get('/:id', async(req,res)=> {
    //nos devuelve todos los elementos de la bd
    const company = await Company.findById(req.params.id)
    if(!company) return res.status(404).send('No hemos encontrado una empresa con ese ID')
    res.send(company)
})


//utilizacion del validator
router.post('/', async(req,res)=> {

    const company = new Company({
        name: req.body.name,
        country: req.body.country
    })

    const result = await company.save()

    res.status(201).send(result)
})


//creación de un put
router.put('/:id', async(req,res)=> {
   
    const company = await  Company.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        country: req.body.country
    }, 
    {
        //nos devuelve el documento actualizado
        new: true
    } )

    if(!company){
        return res.status(404).send('La empresa con ese id no esta en la bd')
    }

    res.status(204).send('El registro se ha actualizado')
})

router.delete('/:id', async(req, res)=>{

    const company = await Company.findByIdAndDelete(req.params.id)

    if(!company){
        return res.status(404).send('La empresa con ese id no esta en la bd, no se puede borrar')
    }

    res.status(200).send('Empresa borrada')
})

module.exports = router