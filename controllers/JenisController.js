const { Jenis, Barang } = require("../models/relation")

const getAllJenis = async (req,res) =>{
    try {
        const pageSize = 5
        const page = parseInt(req.query.page)|| 1;
        const jenis = await Jenis.findAll({
            limit:pageSize,
            offset:( page-1)*pageSize
        })
        res.render('Jenis/listJenis', {data:jenis,currentPage:page,totalPages:pageSize})
    } catch (error) {
        console.log(error)
        res.status(501).json("internal server error"+error.message)
    }
}

const createJenis = async (req,res)=>{
    try {
        const {jenis}= req.body
        if(!jenis)
        {
           return res.status(400).json("jenis harus di isi")
        }
        await Jenis.create({jenis})
        res.redirect('/jenis')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const editJenis =async (req,res)=>{
    try {
            const {id_jenis} = req.params
            const existingJenis = await Jenis.findOne({where:{id_jenis}})
            res.render('Jenis/editJenis',{data:existingJenis})
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const updateJenis =async (req,res)=>{
    try {
        const {id_jenis} = req.params
        const {jenis}  =req.body
        if(!jenis){
            return res.json('jangan kosongkan jenis')
        }
        const existingJenis =await Jenis.findByPk(id_jenis)
        await existingJenis.update({jenis})
        res.redirect('/jenis')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const deleteJenis = async (req,res)=>{
    try {
        const {id_jenis} = req.params
        const exisitingJenis = await Jenis.findByPk(id_jenis)

        const exisitingRelation = await Barang.findOne({where:{id_jenis}})
        if(!exisitingRelation){
            await exisitingJenis.destroy()
            return res.redirect('/jenis')
        }
        
        res.json("tidak bisa dihapus karena ada relasi")
        
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
module.exports ={getAllJenis,createJenis,editJenis,updateJenis,deleteJenis}