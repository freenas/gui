var Montage = require("montage").Montage,
    Model = require("core/model/model").Model;

var ServiceDyndnsService = exports.ServiceDyndnsService = Montage.specialize({

    __serviceDyndnsConstructorServices: {
        value: null
    },

    _serviceDyndnsConstructorServices: {
        get: function() {
            var self = this;
            return this.__serviceDyndnsConstructorServices ?
                Promise.resolve(this.__Services) :
                Model.populateObjectPrototypeForType(Model.ServiceDyndns).then(function (ServiceDyndns) {
                    return self.__serviceDyndnsConstructorServices = ServiceDyndns.constructor.services;
                });
        }
    },

    getProviders: {
        value: function() {
            var self = this;
            return this._serviceDyndnsConstructorServices.then(function(serviceDyndnsConstructorServices) {
                return serviceDyndnsConstructorServices.providers();
            });
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ServiceDyndnsService();
            }
            return this._instance;
        }
    }
});
