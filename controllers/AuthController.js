const jwt = require('jsonwebtoken');
const { User } = require('../models/UserModel');
const formLogin = async (req,res)=>{
    try {
        res.render('login',{layout:false})
    } catch (error) {
        console.log(error)
        res.json(501).json('internal server errror, '+error.message)
    }
}

const login = async (req,res)=>{
    try {
        const {username, password} = req.body
        const user =await User.findOne({where:{username}})
        if(!user){
            return res.json("email atau password belum terdaftar")
        }
        if(password != user.password) {
            return res.json("password tidak sesuai")
        }
        const token = generateToken(user)
        res.cookie('token',token)
        return res.redirect('./criticalPart')
    } catch (error) {
        console.log(error)
        res.json(501).json('internal server errror, '+error.message)
    }
}

const generateToken= (user)=> {
    const token = jwt.sign({user:user}, process.env.SECRET_TOKEN);
    return token;
}

const logout = async (req,res)=>{
    try {
        res.clearCookie('token');
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.json(501).json('internal server errror, '+error.message)
    }
}
module.exports = {formLogin,login,logout}