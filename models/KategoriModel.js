const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Kategori = sequelize.define("Kategori", {
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    kategori: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'kategori',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Kategori};
