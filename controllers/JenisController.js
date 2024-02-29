const { Jenis } = require("../models/JenisModel")

const getAllJenis = async (req,res) =>{
    try {
     
        res.render()
    } catch (error) {
        console.log(error)
        res.status(501).json("internal server error"+error.message)
    }
}