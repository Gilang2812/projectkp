const {User} = require("../models/relation");

const getUserTable = async (req, res) => {
    try {
        const userData = getExcel(req)
        console.log(userData);
 
        res.render('./User/addUser',{data:userData})
        
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Excel error: " + error.message);
    }   
}
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
const createUserForm =async (req,res)=>{
    try {
        const {username,password,status} = req.body
        const newUser = await User.create({
            username:username,password,isadmin:status})

            res.redirect('./user')
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5; 

        const users = await User.findAll({  
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        res.status(200).render('./User/user', {
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

const editUser = async (req,res)=>{
    try {
        const {id_user} = req.params
        const existingUser = await User.findOne({where:{id_user}})
        
        res.render('User/editUser',{data:existingUser, layout:'layout'})
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
}

const updateUser = async (req, res) => {
    const { username, password, status } = req.body;
    const {id_user} = req.params;

    if ( !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({where:{id_user}});

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await existingUser.update(
            { username, password, isadmin:status },
        );

        res.status(200).redirect('/user');
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const deleteUser = async (req, res) => {
    const {id_user} = req.params;

    try {
        const existingUser = await User.findOne({where:{id_user}});

            if (existingUser.isadmin ==1 || existingUser.id_user===req.user.user.id_user) {
          
                return res.status(400).json("akun ini tidak bisa di hapus");
            }
            await User.destroy({ where: { id_user: id_user } });
       
        res.status(204).redirect('/user');
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
    getUserTable,
    createUserForm,
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    profile,
    editUser
};
