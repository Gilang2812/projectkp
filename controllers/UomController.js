const { Uom, Barang } = require("../models/relation")

const getAllUOM = async (req, res) => {
    try {
        const pageSize = 5
        const page = parseInt(req.query.page) || 1;
        const uom = await Uom.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize
        })
        res.render('UOM/listUOM', { data: uom, currentPage: page, totalPages: pageSize })
    } catch (error) {
        console.log(error)
        res.status(501).json("Internal server error" + error.message)
    }
}

const createUOM = async (req, res) => {
    try {
        const { uom } = req.body
        if (!uom) {
            return res.status(400).json("UOM harus di isi")
        }
        await Uom.create({ uom })
        res.redirect('/uom')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const editUOM = async (req, res) => {
    try {
        const { id_uom } = req.params
        const existingUOM = await Uom.findOne({ where: { id_uom } })
        res.render('UOM/editUOM', { data: existingUOM })
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const updateUOM = async (req, res) => {
    try {
        const { id_uom } = req.params
        const { uom } = req.body
        if (!uom) {
            return res.json('Jangan kosongkan UOM')
        }
        const existingUOM = await Uom.findByPk(id_uom)
        await existingUOM.update({ uom })
        res.redirect('/uom')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const deleteUOM = async (req, res) => {
    try {
        const { id_uom } = req.params
        const existingUOM = await Uom.findByPk(id_uom)

        const existingRelation = await Barang.findOne({ where: { id_uom } })
        if (!existingRelation) {
            await existingUOM.destroy()
            return res.redirect('/uom')
        }

        res.json("Tidak bisa dihapus karena ada relasi")

    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
module.exports = { getAllUOM, createUOM, editUOM, updateUOM, deleteUOM }
