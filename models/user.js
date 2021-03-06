const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    isCustumer: Boolean,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean,
    role: String,
    date:{type: Date, default: Date.now}
})

userSchema.methods.generateJWT = function(){
    //utilizando el token 
    return jwt.sign({
        _id: this._id, 
        name: this.name,
        isAdmin:this.isAdmin,
        role: this.role,
    }, process.env.SECRET_KEY_JWT_llavesecreta)
}

const User = mongoose.model('user', userSchema)

module.exports = User