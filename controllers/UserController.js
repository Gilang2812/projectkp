const {User} = require("../models/relation");

const createUser = async (req, res) => {
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
    
       await User.bulkCreate(dataYangDiButuhkan);
    
        res.redirect('/user');
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5; 

        const users = await User.findAll({  
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        const totalCount = await User.count(); 
        const totalPages = Math.ceil(totalCount / pageSize);
        
        res.status(200).render('user', {
            title: 'Express',
            layout: 'layout',
            data: users,
            currentPage: page,
            totalPages: pageSize

        });

    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};


const updateUser = async (req, res) => {
    const { username, password, id_unit } = req.body;
    const userId = req.params.id_user;

    // Validasi manual
    if (!username || !password || !id_unit) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await User.update(
            { username, password, isadmin },
            { where: { id_user: userId } }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id_user;

    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.destroy({ where: { id_user: userId } });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const profile = async (req, res) => {
    const userId = req.user.id_user;
 
    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
 
        res.status(200).json(existingUser);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};
module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    profile
};
