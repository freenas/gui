var Montage = require("montage/core/core").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

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
            this._checkModelIsInitialized();
            return this._dataService.fetchData(this._model);
        }
    },

    get: {
        value: function() {
            return this.list().then(function(entries) {
                return entries[0];
            });
        }
    },

    getEmptyList: {
        value: function() {
            this._checkModelIsInitialized();
            return Promise.resolve(this._dataService.getEmptyCollectionForType(this._model));
        }
    },

    getNewInstance: {
        value: function() {
            this._checkModelIsInitialized();
            return this._dataService.getNewInstanceForType(this._model);
        }
    },

    save: {
        value: function(object) {
            this._checkModelIsInitialized();
            this._checkObjectIsNotNull(object);
            this._checkObjectHasDaoModel(object);
            return this._dataService.saveDataObject(object);
        }
    },

    revert: {
        value: function(object) {
            this._checkModelIsInitialized();
            this._checkObjectIsNotNull(object);
            this._checkObjectHasDaoModel(object);
            return this._dataService.restoreSnapshotVersion(object);
        }
    },

    _checkModelIsInitialized: {
        value: function() {
            if (!this._model) {
                throw new Error("Dao model is not defined.");
            }
        }
    },

    _checkObjectIsNotNull: {
        value: function(object) {
            if (!object || typeof object !== 'object' || !object.Type) {
                throw new Error("Invalid object:", object);
            }
        }
    },

    _checkObjectHasDaoModel: {
        value: function(object) {
            if (object.Type !== this._model) {
                throw new Error("Object type does not match Dao model:", object.Type, this._model);
            }
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this.Model = Model;
                this._instance = new this();
                this._instance._dataService = FreeNASService.instance;
                this._instance.init();
             }
            return this._instance;
         }
    }
});
