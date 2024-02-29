const { Barang } = require("./BarangModel");
const { DetailPemintaanCriticalPart } = require("./DetailPermintaanCriticalPartModel");
const { Jenis } = require("./JenisModel");
const { Kategori } = require("./KategoriModel");
const { Mrp } = require("./MrpModel");
const { Plant } = require("./PlantModel");
const {Unit} = require("./UnitModel");
const { Uom } = require("./UomModel");
const {User} = require("./UserModel");

Unit.belongsTo(Plant,{foreignKey:'id_plant'})
Plant.hasMany(Unit,{foreignKey:'id_plant'})


Unit.hasMany(DetailPemintaanCriticalPart,{foreignKey:'id_unit'})
Barang.hasMany(DetailPemintaanCriticalPart,{foreignKey:'material_master'})
DetailPemintaanCriticalPart.belongsTo(Unit,{foreignKey:'id_unit'})
DetailPemintaanCriticalPart.belongsTo(Barang,{foreignKey:'material_master'})

Jenis.hasMany(Barang,{foreignKey:'id_jenis'})
Mrp.hasMany(Barang,{foreignKey:'id_mrp'})
Uom.hasMany(Barang,{foreignKey:'id_uom'})
Kategori.hasMany(Barang,{foreignKey:'id_kategori'})

Barang.belongsTo(Jenis,{foreignKey:'id_jenis'})
Barang.belongsTo(Mrp,{foreignKey:'id_mrp'})
Barang.belongsTo(Uom,{foreignKey:'id_uom'})
Barang.belongsTo(Kategori,{foreignKey:'id_kategori'})


module.exports ={User,Unit,Plant,Barang,Jenis,DetailPemintaanCriticalPart,Mrp,Uom,Kategori}