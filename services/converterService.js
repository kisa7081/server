const ConvModel = require('../models/convModel');

class ConverterService {

    static getList() {
        return ConvModel.find({})
            .sort({createdDate: -1})
            .then((c) => {
                return c;
            });
    }

    static findById(id) {
        return ConvModel.findOne({'_id': id})
            .then((c) => {
                return c;
            });
    }

    static create(values) {
        const model = new ConvModel(values);
        // Now save the new document
        return model.save()
            .then(() => {
                return model;
            });
    }

    static update(id, values) {
        return ConvModel.findOne({'_id': id})
            .then((conv) => {
                conv.set(values);
                return conv.save()
                    .then((conv) => {
                        return conv;
                    });
            });
    }

    static delete(id) {
        //First we get the document to remove
        return ConvModel.findOne({'_id': id})
            .then((conv) => {
                return conv.remove()
                    .then(() => {
                        return conv;
                    });
            });
    }

    static deleteAll() {
        return ConvModel.deleteMany({})
            .then(() => {
                return;
            });
    }
}


module.exports = ConverterService;
