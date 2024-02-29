const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Jenis = sequelize.define("Jenis", {
    id_jenis: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    jenis: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'jenis',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Jenis};
