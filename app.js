const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
require('./hbsHelper');//Holds Handlebars customizations/helpers
const router = require('./routes/conv');
const apirouter = require('./routes/api/api.conv');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-4kls7.mongodb.net/conversions?retryWrites=true`, {useNewUrlParser: true})
.catch((err)=>{
    console.error(`database connection error: ${err}`);
    process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(cookieParser('bobloblaw'));
app.use(session({
    secret:"bobloblaw",
    resave: "true",
    saveUninitialized: "true"
}));
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/cv', router);
app.use('/api/conv', apirouter);
app.use('/', express.static('../client/client/dist/client'));
app.use('/create', express.static('../client/client/dist/client'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
