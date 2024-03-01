const { Sequelize,DataTypes } = require("sequelize");
const { db } = require("./db");
 
const sequelize = new Sequelize(db)

const User   = sequelize.define('User',{
    id_user:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isNull:{
                msg:"please enter your password"  
            },
            
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    isadmin:{
        type:DataTypes.INTEGER,
    }
},{
    tableName:'user',
    timestamps:true,
    createdAt:'created_at',
    updatedAt:'updated_at'
})

module.exports = {User}