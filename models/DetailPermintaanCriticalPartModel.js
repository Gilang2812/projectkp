    const { Sequelize, DataTypes } = require('sequelize');
    const { db } = require('./db');

    const sequelize = new Sequelize(db);

    const DetailPemintaanCriticalPart = sequelize.define("DetailPemintaanCriticalPart", {
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        material_master: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_unit: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        jan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        feb: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        mar: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        apr: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        mei: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        jun: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        jul: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aug: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sep: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        oct: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nov: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        des: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        tableName: 'detailPermintaan',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    
    module.exports = {DetailPemintaanCriticalPart};
