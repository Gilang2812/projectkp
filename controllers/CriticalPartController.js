const xlsx = require('xlsx');
const {User} = require('../models/UserModel');
const {Unit} = require('../models/UnitModel');
const { DetailPemintaanCriticalPart } = require('../models/DetailPermintaanCriticalPartModel');
const { Barang } = require('../models/BarangModel');
const { Kategori } = require('../models/KategoriModel');
const { Uom } = require('../models/UomModel');
const { Jenis } = require('../models/JenisModel');
const { Mrp } = require('../models/MrpModel');
const { Plant } = require('../models/PlantModel');
const { Sequelize } = require('sequelize');
const { getExcel } = require('./BarangController');

const getUserTable = async (req, res) => {
    try {
        const userData = getExcel(req)
        console.log(userData);
 
        res.render('./User/excel',{data:userData})
        
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }   
}

const getCriticalPart = async (req, res) => {
    try {
        const { jenisFilter, ketersediaanFilter, mrpFilter } = req.query;

        const [jenisBody, mrpBody] = await Promise.all([
            jenisFilter ? Jenis.findOne({ where: { jenis: jenisFilter } }) : null,
            mrpFilter ? Mrp.findOne({ where: { mrp: mrpFilter } }) : null,
        ]);

        const filterConditions = {};
        if (jenisBody && mrpBody) {
            filterConditions['$Barang.Jeni.jenis$'] = jenisFilter;
            filterConditions['$Barang.Mrp.mrp$'] = mrpFilter;
        } else if (jenisBody) {
            filterConditions['$Barang.Jeni.jenis$'] = jenisFilter;
        } else if (mrpBody) {
            filterConditions['$Barang.Mrp.mrp$'] = mrpFilter;
        }

        let criticalParts = await DetailPemintaanCriticalPart.findAll({
            include: [
                {
                    model: Barang,
                    include: [
                        {
                            model: Jenis,
                            attributes: ['jenis'],
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
                            model: Kategori,

                        },
                    ]
                },
                {
                    model: Unit,
                    attributes: ['unit'],
                    include: [{
                        model: Plant,
                        attributes: ['plant']
                    }]
                }
            ],
            where: filterConditions,
        });

        const [jenis, allMrp] = await Promise.all([
            Jenis.findAll(),
            Mrp.findAll(),
        ]);

        const currentMonth = new Date().getMonth();
        const totalMonthlyMap = new Map();
        
        const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'des'];
        
// Initialize totalMonthlyMap outside the loop
 

        criticalParts.forEach(dataItem => {
            const materialMaster = dataItem.material_master;
            
            // If materialMaster is not in the map, initialize it with 0
            if (!totalMonthlyMap.has(materialMaster)) {
                totalMonthlyMap.set(materialMaster, 0);
            }

            let currentMonthValue = 0;

           
                currentMonthValue += dataItem[months[currentMonth]];
        

            // Add currentMonthValue to the total for the specific material_master
            totalMonthlyMap.set(materialMaster, totalMonthlyMap.get(materialMaster) + currentMonthValue);
        });

                
         
        const filteredCriticalParts = criticalParts.filter(dataItem => {
            const onHand = dataItem.Barang?.on_hand || 0;
            const materialMaster = dataItem.material_master;
            const totalMonth = totalMonthlyMap.get(materialMaster) || 0;
        
            if (ketersediaanFilter === 'cukup') {
                // Compare onHand with the totalMonth
                return onHand >= totalMonth;
            } else if (ketersediaanFilter === 'kurang') {
                // Compare onHand with the totalMonth
                return onHand < totalMonth;
            }
        
            // If ketersediaanFilter is neither 'cukup' nor 'kurang', include the item
            return true;
        });
        criticalParts= filteredCriticalParts
        const totalOnHandByCategory = new Map();

        // Loop melalui criticalParts untuk mengumpulkan data
        criticalParts.forEach(dataItem => {
            const barang = dataItem.Barang;
            const kategori = barang?.Kategori?.kategori;
            const onHand = barang?.on_hand || 0;

            if (kategori) {
                totalOnHandByCategory.set(kategori, (totalOnHandByCategory.get(kategori) || 0) + onHand);
            }
        });

        const groupedDetails = {};

        criticalParts.forEach((detail) => {
            const kategoriName = detail.Barang.Kategori.kategori;

            if (!groupedDetails[kategoriName]) {
                groupedDetails[kategoriName] = {
                    uniqueMaterialMasters: new Set(),
                    details: [],
                    sumMonth: 0, // Menambahkan total bulan untuk kategori
                };
            }

            const materialMaster = detail.Barang.material_master;
            let currentMonth = new Date().getMonth();
            let count = 0;

            // Mendapatkan nama bulan berdasarkan nilai numerik
            const monthName = getMonthName(currentMonth + 1);

            // Mengakses nilai bulan secara dinamis dari objek detail
            count = detail[monthName];

            groupedDetails[kategoriName].sumMonth += count;

            if (!groupedDetails[kategoriName].uniqueMaterialMasters.has(materialMaster)) {
                groupedDetails[kategoriName].uniqueMaterialMasters.add(materialMaster);

                groupedDetails[kategoriName].details.push({
                    barang: materialMaster,
                    on_hand: detail.Barang.on_hand,
                });
            }
        });

        // Menghitung totalOnHand dan totalJan untuk setiap kategori
        let totalOnHand = 0;
        let totalJan = 0;

        const dataGrafik = Object.keys(groupedDetails).map((kategori) => {
            const detailsForKategori = groupedDetails[kategori].details;
            const totalOnHandForKategori = detailsForKategori.reduce((sum, detail) => {
                return sum + detail.on_hand;
            }, 0);

            totalOnHand += totalOnHandForKategori;
            totalJan += groupedDetails[kategori].sumMonth; // Menambahkan totalJan untuk kategori

            return {
                kategori: kategori,
                details: detailsForKategori,
                totalOnHandForKategori: totalOnHandForKategori,
                totalJanForKategori: groupedDetails[kategori].sumMonth, // Menambahkan totalJan untuk kategori
            };
        });

    
       
        res.render('criticalPart', {
            layout: 'layout',
            data: {
                criticalParts: filteredCriticalParts,
                totalMonthlyMap,
                jenis,
                mrp: allMrp,
                dataGrafik
            
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }
};



const getTableBody = async (req, res) => {
    try {
        const dataYangDidapat = req.body;
        const dataYangDiButuhkan = await Promise.all(dataYangDidapat.username.map(async (username, index) => {
            if (dataYangDidapat.isAdmin[index] === 'Admin') {
                dataYangDidapat.isAdmin[index] = 1;
            } else {
                dataYangDidapat.isAdmin[index] = 0;
            }
            return {
                username: username,
                password: dataYangDidapat.password[index],
                isadmin: dataYangDidapat.isAdmin[index]
            };
        }));
    
        const newUser = await User.bulkCreate(dataYangDiButuhkan);
    
        console.log(dataYangDidapat.username);
        res.redirect('/user');
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }
};



const test = async (req, res) => {
    try {
        const details = await DetailPemintaanCriticalPart.findAll({
            include: [
                {
                    model: Barang,
                    include: [
                        {
                            model: Kategori,
                        },
                    ],
                },
            ],
        });

        // Mengelompokkan hasil berdasarkan Kategori
        const groupedDetails = {};

        details.forEach((detail) => {
            const kategoriName = detail.Barang.Kategori.kategori;

            if (!groupedDetails[kategoriName]) {
                groupedDetails[kategoriName] = {
                    uniqueMaterialMasters: new Set(),
                    details: [],
                    sumMonth: 0, // Menambahkan total bulan untuk kategori
                };
            }

            const materialMaster = detail.Barang.material_master;
            let currentMonth = new Date().getMonth();
            let count = 0;

            // Mendapatkan nama bulan berdasarkan nilai numerik
            const monthName = getMonthName(currentMonth + 1);

            // Mengakses nilai bulan secara dinamis dari objek detail
            count = detail[monthName];

            groupedDetails[kategoriName].sumMonth += count;

            if (!groupedDetails[kategoriName].uniqueMaterialMasters.has(materialMaster)) {
                groupedDetails[kategoriName].uniqueMaterialMasters.add(materialMaster);

                groupedDetails[kategoriName].details.push({
                    barang: materialMaster,
                    on_hand: detail.Barang.on_hand,
                });
            }
        });

        // Menghitung totalOnHand dan totalJan untuk setiap kategori
        let totalOnHand = 0;
        let totalJan = 0;

        const data = Object.keys(groupedDetails).map((kategori) => {
            const detailsForKategori = groupedDetails[kategori].details;
            const totalOnHandForKategori = detailsForKategori.reduce((sum, detail) => {
                return sum + detail.on_hand;
            }, 0);

            totalOnHand += totalOnHandForKategori;
            totalJan += groupedDetails[kategori].sumMonth; // Menambahkan totalJan untuk kategori

            return {
                kategori: kategori,
                details: detailsForKategori,
                totalOnHandForKategori: totalOnHandForKategori,
                totalJanForKategori: groupedDetails[kategori].sumMonth, // Menambahkan totalJan untuk kategori
            };
        });

        res.json({ data, totalOnHand, totalJan });
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }
};


function getMonthName(monthNumber) {
    const months = [
        "jan", "feb", "mar", "apr", "mei", "jun",
        "jul", "aug", "sep", "oct", "nov", "des"
    ];
    return months[monthNumber - 1] || '';
}




module.exports = { getUserTable,getCriticalPart,getTableBody,test };


