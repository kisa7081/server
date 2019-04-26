const mongoose = require('mongoose');

// Schema constructor reference.
const Schema = mongoose.Schema;

const schema = new Schema({
    sourceAmount : {type : Number, required : true},
    sourceCurrency : {type : String,  required : true},
    targetCurrency : {type : String, required : true},
    rate : {type : Number, required : true},
    convertedAmount : {type : Number, required : true},
    timeStamp : {type : Date, required : true},
    createdDate : {type : Date},
    modifiedDate : {type : Date}
});

schema.pre('save', function(next){
    if (!this.createdDate) {
        this.createdDate = new Date();
    }
    // Initially, the modified date is the
    // same as the created date.  After future
    // updates, the modified date will be
    // different from the created date.
    this.modifiedDate = new Date();
    next();
});

module.exports = mongoose.model("Conv", schema);





































