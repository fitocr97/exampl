const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {expressjwt:expressJwt} = require('express-jwt');
const User = require('./user.model')


require('dotenv').config();
// Accede a las variables de entorno
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const stringSecreto = process.env.JWT_STRING;

//app.use(express.json());

//validar si esta logueado
const validateJWT = expressJwt({ secret: stringSecreto, algorithms: ['HS256'] }); // Middleware
//token loguear
const signToken =  _id => jwt.sign({ _id }, stringSecreto);

//midleware validar token
const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id)
        if(!user){
            return res.status(401).end() //jwt invalido
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

//porteger los endpoints
const isAuthenticated = express.Router().use(validateJWT, findAndAssignUser)

const Auth = {
    login: async (req, res) =>{
        const { body } = req
        try {
            const user = await User.findOne({email: body.email})
            if (!user) {
                res.status(401).send('usuario y/o contraseña incorrecto')
            }else{
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch) {
                    const signed = signToken(user._id)
                    res.status(200).send(signed)
                }else{
                    res.status(401).send('usuario y/o contraseña incorrecto')
                }
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    register: async (req, res) =>{
        const {body} = req
    try{
        const isUser = await User.findOne({email: body.email})
        if(isUser){
            console.log('el usuario ya existe')
            return res.status(403).send('User exist')
        }else{
            const salt = await bcrypt.genSalt()
            const hashed = await bcrypt.hash(body.password, salt)
            const user = await User.create({email: body.email, password: hashed, salt})
            //firmar el jwt
            const signed = signToken(user._id)
        
            //res.send({_id: user._id}) //devolver el id del user
            res.send(signed)
        }
    }catch (err){
        res.status(500).send(err.message)
    }
    },
}

module.exports = {Auth, isAuthenticated}