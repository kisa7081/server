const https = require('https');
const rp = require('request-promise');

const converter = function () {

    // This is the list of currencies used.
    // Simply change, add or remove entries
    // as desired.  However, the Euro doesn't
    // work - the reflective amount (1.0) doesn't
    // get returned for some reason.
    const currencyList =
        {
            'USD': 'Dollar',
            'GBP': 'Pound',
            'MXN': 'Peso',
            'RUB': 'Ruble'
        };

    // Start with these hardcoded values in case
    // something goes wrong getting new values.
    let rates = {
        'USD': [1.0, 0.7622738106, 19.2916409215, 65.7629093477],
        'GBP': [1.3118645638, 1.0, 25.3080201024, 86.2720303851],
        'MXN': [0.0518359223, 0.039513166, 1.0, 3.4088810597],
        'RUB': [0.0152061399, 0.0115912422, 0.2933513908, 1.0]
    };
    // The hardcoded timestamp that goes with the hardcoded
    // values above.
    let timestamp = 'March 3, 2019, 3:00:47 PM CST';

    // Used for iteration.
    const keys = Object.keys(currencyList);

    const keysJoined = keys.join(',');

    // A function to reach out to get new rate values.
    const refreshRates = async function () {
        // The rateBuilder is used to gather the rates and
        // ensure that we have a complete rate array before
        // changing the rate array.
        let rateBuilder = {};
        // Iterate over the list of currencies.
        for (let i = 0; i < keys.length; i++) {
            const options = {
                uri: 'https://api.exchangeratesapi.io/latest?base=' + keys[i] + '&symbols=' + keysJoined,
                json: true
            };
            await rp(options)
                .then(function (r) {
                    let base = r.base;
                    let rateSymbols = r.rates;
                    let ratesArray = [];
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        ratesArray.push(rateSymbols[key]);
                    }
                    rateBuilder[base] = ratesArray;
                    if (Object.keys(rateBuilder).length == keys.length) {
                        // We're done and have a complete array, so
                        // set the rates array to the rateBuilder.
                        rates = rateBuilder;
                        timestamp = createTimestamp();
                    }
                });
        }
    };

    // The initial setting of values.
    refreshRates();

    // Create and format a timestamp.
    const createTimestamp = function(){
        const options = {
            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric',
            minute: 'numeric', second: 'numeric', timeZoneName: "short"
        };
        const now = new Date();
        return now.toLocaleDateString("en-US", options);
    };

    const getTimestamp = function () {
        return timestamp;
    };

    const getCurrencyList = function () {
        return currencyList;
    };

    // The method used to make a conversion.
    const createConv = function (q) {
        let rate;
        let targetCurrency;
        if(q._id && q.rate){
            // An existing id and existing rate means this is for modification
            // from the GUI page where the user specified the rate value.
            rate = q.rate;
            targetCurrency = q.targetCurrency;
        }
        else {
            // This is a new conversion or API test, so look up the rate.
            rate = rates[q.sourceCurrency][q.targetCurrency];
            targetCurrency = Object.keys(getCurrencyList())[q.targetCurrency]
        }
        // Calculate the converted amount.
        let converted = Number.parseFloat(q.sourceAmount * rate).toFixed(2);
        return {
            sourceAmount : q.sourceAmount,
            sourceCurrency : q.sourceCurrency,
            targetCurrency : targetCurrency,
            rate : rate,
            convertedAmount : converted,
            timeStamp : createTimestamp()
        };
    };

    const getRates = function (){
        return rates;
    };

    return {
        "getTimestamp": getTimestamp,
        "getCurrencyList": getCurrencyList,
        "createConv": createConv,
        "refreshRates" : refreshRates,
        "getRates" : getRates
    }
};

module.exports = converter();





