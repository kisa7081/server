const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const converter = require('../controllers/convController');
const ConvService = require('../services/converterService');

router.use(flash());

/* GET home page. */
router.get('/', function (req, res, next) {
    ConvService.getList()
        .then((c) => {
            res.render('index', {
                timestamp: converter.getTimestamp(),
                conversions: c,
                flashMsg: req.flash('err'),
                errorIndex: req.query.errorIndex
            });
        });
});

router.get('/input', function (req, res, next) {
    res.render('convert',
        {
            timestamp: converter.getTimestamp(),
            currencyList: converter.getCurrencyList(),
            flashMsg: req.flash('err')
        }
    );
});

router.post('/input/create', function (req, res, next) {
    const c = converter.createConv(req.body);
    ConvService.create(c)
        .then(() => {
            res.redirect('../');
        }).catch((err) => {
        req.flash('err', 'Please enter a number for the amount.');
        res.redirect('/input');
    });
});

router.post('/input/update', async function (req, res, next) {
    try {
        const values = converter.createConv(req.body);
        await ConvService.update(req.body._id, values);
        res.redirect('../');
    } catch (err) {
        req.flash('err', 'Please enter a number for the amount.');
        res.redirect('/?errorIndex=' + req.body.counter);
    }
});

router.post('/input/delete', async function (req, res, next) {
    await ConvService.delete(req.body._id);
    res.redirect('../');
});

router.get('/input/refresh', async function (req, res, next) {
    //Get the latest rates from web service
    await converter.refreshRates();
    res.redirect('../');

});

router.get('/input/deleteAll', function (req, res, next) {
    // Clear the database of conversions.
    ConvService.deleteAll()
        .then(() => {
            res.redirect('../');
        });
});

module.exports = router;
