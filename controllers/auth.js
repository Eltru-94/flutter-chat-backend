const { response } = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');

const newUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya està registrado'
            })
        }
        const user = new User(req.body)
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        //Generar JWT
        const token = await generarJWT(user.id);
        res.json({
            ok: true,
            msg: user,
            token: token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }


}

const LoginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }
        //Valiadar password
        const validPassword= bcrypt.compareSync(password,userDB.password)
        
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto'
            })
        }

        const token = await generarJWT(userDB.id)

        res.json({
            ok: true,
            user:userDB,
            token:token
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

const renewToken= async(req,res=response)=>{

    const uid =req.uid;

    const userDB = await User.findById(uid)
    const token = await generarJWT(userDB.id)
    res.json({
        ok: true,
        user: userDB,
       token
    })
}

module.exports = {
    newUser,
    LoginUser,
    renewToken
}