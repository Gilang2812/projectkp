var express = require('express');
const { getAllUnit } = require('../controllers/UnitController');
const { getAllUsers, createUser } = require('../controllers/UserController');
const { getUserTable, getCriticalPart, getDataExcel, getTableBody, test } = require('../controllers/CriticalPartController');
const { getDetailPermintaan, getPermintaanExcel, createCriticalPart } = require('../controllers/DetailCriticalPartController');
const multer = require('multer');
const { getAllBarng, getExcelBarang, AddBarang, createBarang } = require('../controllers/BarangController');
const { formLogin, login, logout } = require('../controllers/AuthController');
const { authenticateToken } = require('../controllers/middleware');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

var router = express.Router();

router.get('/login',formLogin)
router.post('/login',login)

router.use(authenticateToken)
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Home' ,layout:'layout',page:"home"});
});
router.get('/unit',getAllUnit)
router.get('/user',getAllUsers)
router.get('/criticalPart',getCriticalPart)
router.get('/excel',getDataExcel)
router.get('/permintaan',getDetailPermintaan)
router.post('/add',createUser)
router.post('/addPermintaan',createCriticalPart)
router.get('/test',test)
router.get('/barang',getAllBarng)
router.get('/addBarang',AddBarang)
router.post('/addBarang',createBarang)
router.post('/logout',logout)
router.use(upload.single('excelFile'))
router.post('/excel', getUserTable);
router.post('/excelPermintaan',getPermintaanExcel),
router.post('/excelBarang',getExcelBarang)
module.exports = router;
