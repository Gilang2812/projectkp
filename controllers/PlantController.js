const { Plant, Unit } = require("../models/relation")

const getAllPlant = async (req, res) => {
    try {
        const pageSize = 5
        const page = parseInt(req.query.page) || 1;
        const plant = await Plant.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize
        })
        res.render('Plant/listPlant', { data: plant, currentPage: page, totalPages: pageSize })
    } catch (error) {
        console.log(error)
        res.status(501).json("Internal server error" + error.message)
    }
}

const createPlant = async (req, res) => {
    try {
        const { plant } = req.body
        if (!plant) {
            return res.status(400).json("Plant harus di isi")
        }
        await Plant.create({ plant })
        res.redirect('/plant')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const editPlant = async (req, res) => {
    try {
        const { id_plant } = req.params
        const existingPlant = await Plant.findOne({ where: { id_plant } })
        res.render('Plant/editPlant', { data: existingPlant })
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const updatePlant = async (req, res) => {
    try {
        const { id_plant } = req.params
        const { plant } = req.body
        if (!plant) {
            return res.json('Jangan kosongkan Plant')
        }
        const existingPlant = await Plant.findByPk(id_plant)
        await existingPlant.update({ plant })
        res.redirect('/plant')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const deletePlant = async (req, res) => {
    try {
        const { id_plant } = req.params
        const existingPlant = await Plant.findByPk(id_plant)

        const existingRelation = await Unit.findOne({ where: { id_plant } })
        if (!existingRelation) {
            await existingPlant.destroy()
            return res.redirect('/plant')
        }

        res.json("Tidak bisa dihapus karena ada relasi")

    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
module.exports = { getAllPlant, createPlant, editPlant, updatePlant, deletePlant }
