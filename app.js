require('dotenv').config()

var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false,parameterLimit:1000000,limit:'500mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, parameterLimit: 1000000,limit:'500mb' }));

app.use(express.static('public'));
app.use(expressLayouts);
app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;
