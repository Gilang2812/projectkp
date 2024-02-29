const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Barang = sequelize.define("Barang", {
    material_master: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    deskripsi: {
        type: DataTypes.STRING,
    },
    id_kategori: {
        type: DataTypes.INTEGER,
    },
    id_jenis: {
        type: DataTypes.INTEGER,
    },
    id_mrp: {
        type: DataTypes.INTEGER,
    },
    id_uom: {
        type: DataTypes.INTEGER,
    },
    on_hand: {
        type: DataTypes.INTEGER,
    },
    on_proccess: {
        type: DataTypes.INTEGER,
    },
    on_po: {
        type: DataTypes.INTEGER,
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ket: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'barang',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Barang};
