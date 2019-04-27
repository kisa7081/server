const express = require('express');
const router = express.Router();
const ConvService = require('../../services/converterService');
const converter = require('../../controllers/convController');

router.use((req, res, next) => {
    res.set({
        //CORS
        // allow any domain, allow REST methods we've implemented
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
        // Using res.json negates needing "content-type"
    });
    if (req.method == 'OPTIONS'){
        // This is a pre-flight, so return a 200 code.
        return res.status(200).end();
    }
    next();
});

router.get('/refreshRates', async function (req, res, next) {
    //Get the latest rates from web service
    await converter.refreshRates();
    res.end();
});

router.get('/timestamp', (req, res, next) =>{
    try {
        console.log(converter.getTimestamp());
        res.json(converter.getTimestamp());
        res.end();
    } catch (err) {
        console.log(err);
        res.status(404);
        res.end();
    }
});

/* DELETE document via DELETE */
router.delete('/deleteAll', async (req, res, next) => {
    const c = await ConvService.deleteAll();
    res.json(c);
    res.end();
});

/* GET currencies to populate test API page */
router.get('/currencies', (req, res, next) =>{
    const c = converter.getCurrencyList();
    res.json(c);
    res.end();
});

/* GET all documents */
router.get('/', (req, res, next) =>{
    ConvService.getList()
        .then((c) => {
            res.json(c);
            res.end();
        });
});

/* GET document by id. */
router.get('/:id', (req, res, next) => {
    ConvService.findById(req.params.id)
        .then((c) => {
            res.json(c);
            res.end();
        });
});

/* Create document via POST*/
router.post('/', (req, res, next) => {
    let c = converter.createConv(req.body);
    ConvService.create(c)
        .then((mc) => {
            res.json(mc);
            res.end();
        }).catch((err) => {
            res.status(500);
            res.end();
    });
});

/* UPDATE document via PUT */
router.put('/:id', async function (req, res, next) {
    try {
        const values = converter.createConv(req.body);
        const c = await ConvService.update(req.body._id, values);
        res.json(c);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(404);
        res.end();
    }
});

/* DELETE document via DELETE */
router.delete('/:id', async (req, res, next) => {
    const c = await ConvService.delete(req.params.id);
    res.json(c);
    res.end();
});


module.exports = router;
