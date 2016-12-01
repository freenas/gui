var Montage = require("montage").Montage,
    Model = require("core/model/model").Model;

var NtpServerService = exports.NtpServerService = Montage.specialize({

    __ntpServerServices: {
        value: null
    },

    _ntpServerServices: {
        get: function() {
            var self = this;
            return this.__ntpServerServices ?
                Promise.resolve(this.__ntpServerServices) :
                Model.populateObjectPrototypeForType(Model.NtpServer).then(function (NtpServer) {
                    return self.__ntpServerServices = NtpServer.services;
                });
        }
    },

    ntpSyncNow: {
        value: function(address) {
            var self = this;
            return this._ntpServerServices.then(function(ntpServerServices) {
                return ntpServerServices.syncNow(address);
            });
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new NtpServerService();
            }
            return this._instance;
        }
    }
});
