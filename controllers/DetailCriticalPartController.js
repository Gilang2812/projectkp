const xlsx = require('xlsx')
const {
  Kategori,
  Mrp,
  Uom,
  Jenis,
  Barang,
  DetailPemintaanCriticalPart,
  Unit,
  Plant 
} = require('../models/relation')
const { getExcel } = require('./BarangController')

const getAllDetailPermintaan = async (req,res)=>{
  try {
    const allCP = await DetailPemintaanCriticalPart.findAll({
      include:[{
        model:Barang,
        include:[{
          model:Kategori
        },
        {
          model:Jenis
        },{
          model:Mrp
        },{
          model:Mrp
        },{
          model:Uom
        }
      ]
      },{
        model:Unit,
        include:[{
          model:Plant
        }]
      }]
    }) 
    res.render('CriticalPart/listCriticalPart',{data:allCP})
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error, ' + error.message);
  }
}

const editDetailPermintaan = async (req,res)=>{
  try {
    const {tahun,material_master,id_unit} = req.params
    const existingCp = await DetailPemintaanCriticalPart.findOne({
      where:{tahun,material_master,id_unit},
      include:[{
        model:Barang,
        include:[{
          model:Kategori
        },
        {
          model:Jenis
        },{
          model:Mrp
        },{
          model:Mrp
        },{
          model:Uom
        }
      ]
      },{
        model:Unit,
        include:[{
          model:Plant
        }]
      }]
    }) 
    res.render('CriticalPart/editCriticalPart',{data:existingCp})
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error, ' + error.message);
  }
}

const updateDetailPermintaan = async (req,res)=>{
  try {
    let {jan,feb,mar,apr,mei,jun,jul,aug,sep,oct,nov,des} = req.body
    const {material_master,tahun,id_unit} =req.params

    const existingCp = await DetailPemintaanCriticalPart.findOne({
      where:{material_master,tahun,id_unit}
    })
    await existingCp.update({jan,feb,mar,apr,mei,jun,jul,aug,sep,oct,nov,des})

    res.redirect('/listCp')
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error, ' + error.message);
  }
}
const deleteDetailPermintaan =async (req,res)=>{
  try {
    const {material_master,tahun,id_unit} =req.params

    const existingCp = await DetailPemintaanCriticalPart.findOne({
      where:{material_master,tahun,id_unit}
    })

    await existingCp.destroy()
    res.redirect('/listCp')
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error, ' + error.message);
  }
}
const getDetailPermintaan = async (req, res) => {
  try {
    const barangs = await Barang.findAll()
    const  units = await Unit.findAll()
    res.render('detailPermintaan', { layout: 'layout',barangs,units })
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal Excel error: ' + error.message)
  }
}
const getCriticalPart = async (req, res) => {
  try {
    const { jenisFilter, ketersediaanFilter, mrpFilter } = req.query

    const [jenisBody, mrpBody] = await Promise.all([
      jenisFilter ? Jenis.findOne({ where: { jenis: jenisFilter } }) : null,
      mrpFilter ? Mrp.findOne({ where: { mrp: mrpFilter } }) : null
    ])

    const filterConditions = {}
    if (jenisBody && mrpBody) {
      filterConditions['$Barang.Jeni.jenis$'] = jenisFilter
      filterConditions['$Barang.Mrp.mrp$'] = mrpFilter
    } else if (jenisBody) {
      filterConditions['$Barang.Jeni.jenis$'] = jenisFilter
    } else if (mrpBody) {
      filterConditions['$Barang.Mrp.mrp$'] = mrpFilter
    }

    let criticalParts = await DetailPemintaanCriticalPart.findAll({
      include: [
        {
          model: Barang,
          include: [
            {
              model: Jenis,
              attributes: ['jenis']
            },
            {
              model: Uom,
              attributes: ['uom']
            },
            {
              model: Mrp,
              attributes: ['mrp']
            },
            {
              model: Kategori
            }
          ]
        },
        {
          model: Unit,
          attributes: ['unit'],
          include: [
            {
              model: Plant,
              attributes: ['plant']
            }
          ]
        }
      ],
      where: filterConditions
    })

    const [jenis, allMrp] = await Promise.all([Jenis.findAll(), Mrp.findAll()])

    const currentMonth = new Date().getMonth()
    const totalMonthlyMap = new Map()

    const months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'mei',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'des'
    ]

    criticalParts.forEach(dataItem => {
      const materialMaster = dataItem.material_master

      // If materialMaster is not in the map, initialize it with 0
      if (!totalMonthlyMap.has(materialMaster)) {
        totalMonthlyMap.set(materialMaster, 0)
      }

      let currentMonthValue = 0

      currentMonthValue += dataItem[months[currentMonth]]

      // Add currentMonthValue to the total for the specific material_master
      totalMonthlyMap.set(
        materialMaster,
        totalMonthlyMap.get(materialMaster) + currentMonthValue
      )
    })

    const filteredCriticalParts = criticalParts.filter(dataItem => {
      const onHand = dataItem.Barang?.on_hand || 0
      const materialMaster = dataItem.material_master
      const totalMonth = totalMonthlyMap.get(materialMaster) || 0

      if (ketersediaanFilter === 'cukup') {
        // Compare onHand with the totalMonth
        return onHand >= totalMonth
      } else if (ketersediaanFilter === 'kurang') {
        // Compare onHand with the totalMonth
        return onHand < totalMonth
      }

      // If ketersediaanFilter is neither 'cukup' nor 'kurang', include the item
      return true
    })
    criticalParts = filteredCriticalParts
    const totalOnHandByCategory = new Map()

    // Loop melalui criticalParts untuk mengumpulkan data
    criticalParts.forEach(dataItem => {
      const barang = dataItem.Barang
      const kategori = barang?.Kategori?.kategori
      const onHand = barang?.on_hand || 0

      if (kategori) {
        totalOnHandByCategory.set(
          kategori,
          (totalOnHandByCategory.get(kategori) || 0) + onHand
        )
      }
    })

    const groupedDetails = {}

    criticalParts.forEach(detail => {
      const kategoriName = detail.Barang.Kategori.kategori

      if (!groupedDetails[kategoriName]) {
        groupedDetails[kategoriName] = {
          uniqueMaterialMasters: new Set(),
          details: [],
          sumMonth: 0 // Menambahkan total bulan untuk kategori
        }
      }

      const materialMaster = detail.Barang.material_master
      let currentMonth = new Date().getMonth()
      let count = 0

      // Mendapatkan nama bulan berdasarkan nilai numerik
      const monthName = getMonthName(currentMonth + 1)

      // Mengakses nilai bulan secara dinamis dari objek detail
      count = detail[monthName]

      groupedDetails[kategoriName].sumMonth += count

      if (
        !groupedDetails[kategoriName].uniqueMaterialMasters.has(materialMaster)
      ) {
        groupedDetails[kategoriName].uniqueMaterialMasters.add(materialMaster)

        groupedDetails[kategoriName].details.push({
          barang: materialMaster,
          on_hand: detail.Barang.on_hand
        })
      }
    })

    // Menghitung totalOnHand dan totalJan untuk setiap kategori
    let totalOnHand = 0
    let totalJan = 0

    const dataGrafik = Object.keys(groupedDetails).map(kategori => {
      const detailsForKategori = groupedDetails[kategori].details
      const totalOnHandForKategori = detailsForKategori.reduce(
        (sum, detail) => {
          return sum + detail.on_hand
        },
        0
      )

      totalOnHand += totalOnHandForKategori
      totalJan += groupedDetails[kategori].sumMonth // Menambahkan totalJan untuk kategori

      return {
        kategori: kategori,
        details: detailsForKategori,
        totalOnHandForKategori: totalOnHandForKategori,
        totalJanForKategori: groupedDetails[kategori].sumMonth // Menambahkan totalJan untuk kategori
      }
    })

    res.render('criticalPart', {
      layout: 'layout',
      data: {
        criticalParts: filteredCriticalParts,
        totalMonthlyMap,
        jenis,
        mrp: allMrp,
        dataGrafik
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal Excel error: ' + error.message)
  }
}

function getMonthName (monthNumber) {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'mei',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'des'
  ]
  return months[monthNumber - 1] || ''
}

const createCriticalPart = async (req, res) => {
  try {
    const dataTable = req.body
    const createdRecords = []

    for (let index = 0; index < dataTable.material_master.length; index++) {
      let material_master = dataTable.material_master[index]
      let [existingKategori] = await Kategori.findOrCreate({
        where: { kategori: dataTable.kategori[index] }
      })
      let [existingMrp] = await Mrp.findOrCreate({
        where: { mrp: dataTable.mrp[index] }
      })
      let [existingUom] = await Uom.findOrCreate({
        where: { uom: dataTable.uom[index] }
      })
      let [existingJenis] = await Jenis.findOrCreate({
        where: { jenis: dataTable.jenis[index] }
      })
      let [existingUnit] = await Unit.findOrCreate({
        where: { unit: dataTable.user[index] }
      })
      let [existingBarang] = await Barang.findOrCreate({
        where: {
          material_master: material_master,
          id_mrp: existingMrp.id_mrp,
          id_jenis: existingJenis.id_jenis,
          id_kategori: existingKategori.id_kategori,
          id_uom: existingUom.id_uom
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
      })
      let [existingPermintaan] = await DetailPemintaanCriticalPart.findOrCreate(
        {
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
        }
      )

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
      })
    }

    res.redirect('/criticalPart')
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal server error: ' + error.message)
  }
}

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

const createPermintaanForm = async (req, res) => {
  try {
    let {
      material_master,
      id_unit,
      tahunData,
      jan,
      feb,
      mar,
      apr,
      mei,
      jun,
      jul,
      ags,
      sep,
      okt,
      nov,
      des
    } = req.body
    jan = jan || 0
    feb = feb || 0
    mar = mar || 0
    apr = apr || 0
    mei = mei || 0
    jun = jun || 0
    jul = jul || 0
    ags = ags || 0
    sep = sep || 0
    okt = okt || 0
    nov = nov || 0
    des = des || 0

    const existingPermintaan = await DetailPemintaanCriticalPart.findOne({where:{tahun:tahunData,material_master,id_unit}})
    if(existingPermintaan){
      return res.json("data sudah ada")
    }
    await DetailPemintaanCriticalPart.create({tahun:tahunData,material_master,id_unit,jan,feb,mar,apr,mei,jun,jul,aug:ags,sep,oct:okt,nov,des})
    res.redirect('/listCp')
  } catch (error) {
    console.error(error)
    res.status(500).json('Internal server error, ' + error.message)
  }
}

module.exports = {
  createCriticalPart,
  getDetailPermintaan,
  getCriticalPart,
  getPermintaanExcel,
  createPermintaanForm,
  getAllDetailPermintaan,
  editDetailPermintaan,
  updateDetailPermintaan,
  deleteDetailPermintaan
}
