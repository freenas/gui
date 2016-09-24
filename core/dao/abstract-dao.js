var Montage = require("montage/core/core").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService;

exports.AbstractDao = Montage.specialize({
    _instance: {
        value: null
    },

    init: {
        value: function() {
            throw new Error("Dao must override `init` method.");
        }
    },

    list: {
        value: function() {
            if (this._model) {
                return this._dataService.fetchData(this._model);
            } else {
                throw new Error("Dao model is not defined.");
            }
        }
    },

    getEmptyList: {
        value: function() {
            if (this._model) {
                return this._dataService.getEmptyCollectionForType(this._model);
            } else {
                throw new Error("Dao model is not defined.");
            }
        }
    },

    getNewInstance: {
        value: function() {
            if (this._model) {
                return this._dataService.getNewInstanceForType(this._model);
            } else {
                throw new Error("Dao model is not defined.");
            }
        }
    },

    save: {
        value: function(object) {
            if (this._model) {
                if (object && object.Type === this._model) {
                    return this._dataService.saveDataObject(object);
                } else {
                    throw new Error("Object type does not match Dao model:", object.Type, this._model);
                }
            } else {
                throw new Error("Dao model is not defined.");
            }
        }
    } 
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance._dataService = FreeNASService.instance;
                this._instance.init();
             }
            return this._instance;
         }
    }
});
