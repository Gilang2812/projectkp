const xlsx = require('xlsx')
const {
  Kategori,
  Mrp,
  Uom,
  Jenis,
  Barang,
  DetailPemintaanCriticalPart,
  Unit
} = require('../models/relation')
const getDetailPermintaan = async (req, res) => {
  try {
    res.render('detailPermintaan', { layout: 'layout' })
  } catch (error) {}
}
const createCriticalPart = async (req, res) => {
    try {
        const dataTable = req.body;
        const createdRecords = [];
        
        for (let index = 0; index < dataTable.material_master.length; index++) {
            let material_master = dataTable.material_master[index]; 
            let [existingKategori] = await Kategori.findOrCreate({ where: { kategori: dataTable.kategori[index] } })
            let [existingMrp] = await Mrp.findOrCreate({ where: { mrp: dataTable.mrp[index] } }); 
            let [existingUom] = await Uom.findOrCreate({ where: { uom: dataTable.uom[index] } }); 
            let [existingJenis] = await Jenis.findOrCreate({ where: { jenis: dataTable.jenis[index] } }); 
            let [existingUnit] = await Unit.findOrCreate({ where: { unit: dataTable.user[index] } }); 
            let [existingBarang] = await Barang.findOrCreate({
                where: {
                    material_master: material_master,
                    id_mrp: existingMrp.id_mrp,
                    id_jenis: existingJenis.id_jenis,
                    id_kategori: existingKategori.id_kategori,
                    id_uom: existingUom.id_uom,
                },
                defaults: {
                    material_master: material_master,
                    deskripsi: dataTable.deskripsi[index],
                    quantity: dataTable,
                    id_mrp: existingMrp.id_mrp,
                    id_jenis: existingJenis.id_jenis,
                    id_kategori: existingKategori.id_kategori,
                    id_uom: existingUom.id_uom,
                    on_hand: dataTable.on_hand[index],
                    on_po: dataTable.on_po[index],
                    on_proccess: dataTable.on_pr[index],
                    harga: dataTable.unit[index],
                    ket: dataTable.ket[index]
                }
            }); 
            let [existingPermintaan] = await DetailPemintaanCriticalPart.findOrCreate({
                where: {
                    tahun: dataTable.tahun,
                    material_master: existingBarang.material_master,
                    id_unit: existingUnit.id_unit
                },
                defaults: {
                    tahun: dataTable.tahun,
                    material_master: existingBarang.material_master,
                    id_unit: existingUnit.id_unit,
                    jan: dataTable.jan[index],
                    feb: dataTable.feb[index],
                    mar: dataTable.mar[index],
                    apr: dataTable.apr[index],
                    mei: dataTable.mei[index],
                    jun: dataTable.jun[index],
                    jul: dataTable.jul[index],
                    aug: dataTable.aug[index],
                    sep: dataTable.sep[index],
                    oct: dataTable.oct[index],
                    nov: dataTable.nov[index],
                    des: dataTable.des[index]
                }
            });

            createdRecords.push({
                material_master: material_master,
                deskripsi: dataTable.deskripsi[index],
                kategori: dataTable.kategori[index],
                jenis: dataTable.jenis[index],
                mrp: dataTable.mrp[index],
                on_hand: dataTable.on_hand[index],
                on_proccess: dataTable.on_pr[index],
                on_po: dataTable.on_po[index],
                user: dataTable.user[index],
                uom: dataTable.uom[index],
                unit: dataTable.unit[index],
                total_price: dataTable.total_price[index],
                total_price_year: dataTable.total_price_year[index]
            });
        }

        res.redirect('/criticalPart');
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error: ' + error.message);
    }
};



const getPermintaanExcel = async (req, res) => {
  try {
    const excelFile = req.file

    if (!excelFile) {
      return res.status(400).json('File Excel tidak ditemukan.')
    }

    const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' })

    const sheetName = req.body.sheetName || workbook.SheetNames[0]

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

    console.log(data)

    res.render('detailPermintaan', { data: data })
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal Excel error: ' + error.message)
  }
}

module.exports = { createCriticalPart, getDetailPermintaan, getPermintaanExcel }
