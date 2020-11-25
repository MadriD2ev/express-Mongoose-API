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

//utilizacion del validator
router.post('/',[
    //si esta vacio
    // password must be at least 3 chars long
    body('email').isLength({ min: 2 }),
    body('password').isLength({ min: 3 })
], async(req,res)=> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Usuario o contraseña incorrectos')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Usuario o contraseña incorrectos')

    //utilizando el token 
    const jwtToken = user.generateJWT()

    //res.send(jwtToken)
    res.status(201).header('Autorization', jwtToken).send({
        _id: user._id,
        name: user.name,
        email: user.email
    })
})

module.exports = router

