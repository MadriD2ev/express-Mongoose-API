//const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const express = require('express')
//para validaciones de datos
const { body, validationResult } = require('express-validator');

//importar modelo 
const User = require('../models/user')

//refactorizando código
const router = express.Router()





//metodo get 
router.get('/', async(req,res)=> {
     //nos devuelve todos los elementos de la bd
     const users = await User.find()
     res.send(users)
})

router.get('/:id', async(req,res)=> {
    //nos devuelve todos los elementos de la bd
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('No hemos encontrado un usuario con ese ID')
    res.send(user)
})


//utilizacion del validator
router.post('/',[
    //si esta vacio
    body('name').isLength({ min: 2 }),
    // password must be at least 3 chars long
    body('email').isLength({ min: 2 }),
    body('password').isLength({ min: 3 })
], async(req,res)=> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //verificar que el email no este repetido, este es nuestro identificador unico
    let user2 = await User.findOne({email: req.body.email})
    if(user2) return res.status(400).send('Este usuario ya existe')

    //hacer el hash del password, hacer primero para cuando lo guardamos y luego el metodo complete para comprobar
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    

    const user = new User({
        name: req.body.name,
        isCustumer: false,
        email: req.body.email,
        password: hashPassword
    })

    const result = await user.save()

    //utilizando el token 
    const jwtToken = user.generateJWT()

    res.status(201).header('Autorization', jwtToken).send({
        _id: user._id,
        name: user.name,
        email: user.email
    })
})


//creación de un put
router.put('/:id',[
    //si esta vacio
    body('name').isLength({ min: 2 }),
    // password must be at least 3 chars long
    body('email').isLength({ min: 2 })
], async(req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = await  User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isCustumer: req.body.isCustumer,
        email: req.body.email
    }, 
    {
        //nos devuelve el documento actualizado
        new: true
    } )

    if(!user){
        return res.status(404).send('El usuario con ese id no esta en la bd')
    }

    res.status(204).send('El registro se ha actualizado')
})

router.delete('/:id', async(req, res)=>{

    const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return res.status(404).send('El usuario con ese id no esta en la bd, no se puede borrar')
    }

    res.status(200).send('Usuario borrado')
})

module.exports = router