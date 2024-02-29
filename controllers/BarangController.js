const xlsx = require('xlsx')
const {Barang, Kategori, Jenis, Unit, Mrp, Uom} = require('../models/relation')

const getAllBarng = async(req,res)=>{
    try {

        const allBarang = await Barang.findAll({
            include : [
                {
                model:Kategori,
                attributes:['kategori']
                },{
                    model:Jenis,
                    attributes:['jenis']
                },{
                    model:Mrp,
                    attributes:['mrp']
                },{
                    model:Uom,
                    attributes:['uom']
                }
            ]
        })
        res.render('./Barang/listBarang',{layout:'layout' ,data:allBarang})
    } catch (error) {
        
    }
}
const AddBarang = async (req,res)=>{
    try {
        res.render('./Barang/AddBarang',{layout:'layout'})
    } catch (error) {
        console.log(error)
        res.json(501).json('internal server errror, '+error.message)
    }
}

const getExcelBarang =async(req,res)=>{
    try {     
        const data = getExcel(req)
     
        res.render('./Barang/AddBarang',{data:data})
    } catch (error) {
        console.log(error)
        res.status(501).json('internal server errror, '+error.message)
    }
}

const  createBarang =async (req,res)=>{
    try {
        const data = req.body

        await Promise.all(data.material_master.map(async(barang,index)=>{
            let jenis =  data.jenis[index]
            let mrp =  data.mrp[index]
            let uom =  data.uom[index]
            let kategori =  data.kategori[index]
            let material_master = barang

            let existingJenis = await Jenis.findOne({where:{jenis:data.jenis[index]}})
            let existingMrp = await Mrp.findOne({where:{mrp:data.mrp[index]}})
            let existingUom = await Uom.findOne({where:{uom:data.uom[index]}})
            let existingKategori = await Kategori.findOne({where:{kategori:data.kategori[index]}})
            let existingBarang = await Barang.findOne({where:{material_master:barang}})

            if(!existingJenis){
                let newJenis = await Jenis.create(jenis)
                existingJenis = newJenis
            }
            if(!existingKategori){
                let newKaexistingKategori = await Kategori.create(kategori)
                existingKategori = newKaexistingKategori
            }
            if(!existingMrp){
                let newMrp = await Mrp.create(mrp)
                existingMrp = newMrp
            }
            if(!existingUom){
                let newUom = await Uom.create(uom)
                existingUom = newUom
            }
            if(!existingBarang){
             await Barang.create({
                    material_master:material_master,
                    deskripsi:data.deskripsi[index],
                    harga:data.harga[index],
                    on_hand:data.on_hand[index],
                    on_po:data.on_po[index],
                    on_proccess:data.on_proccess[index],
                    jenis:existingJenis.id_jenis,
                    kategori:existingKategori.id_Lategori,
                    uom:existingUom.id_uom,
                    mrp:existingMrp.id_mrp,
                    ket:data.ket[index]
                })
               
            }else{
                
                await existingBarang.update({
                    deskripsi:data.deskripsi[index],
                    harga:data.harga[index],
                    on_hand:data.on_hand[index],
                    on_proccess:data.on_proccess[index],
                    on_po:data.on_po[index],
                    ket:data.ket[index],
                    jenis,
                    kategori,
                    uom,
                    mrp
                })
            }


        }))
        res.redirect('barang')
    } catch (error) {
        console.log(error)
        res.json(501).json('internal server errror, '+error.message)
    }
}

    
function getExcel(req){
    const excelFile = req.file;

    if (!excelFile) {
        return res.status(400).json("File Excel tidak ditemukan.");
    }

    const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });

   const sheetName = req.body.sheetName || workbook.SheetNames[0];

     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
     return data

}

module.exports = {getAllBarng,getExcel,getExcelBarang,AddBarang, createBarang}
