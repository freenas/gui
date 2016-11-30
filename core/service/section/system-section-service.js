var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    Model = require("core/model/model").Model;

exports.SystemSectionService = AbstractSectionService.specialize({
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

    init: {
        value: function(systemRepository) {
            this._systemRepository = systemRepository || SystemRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._systemRepository.listSystemSections();
        }
    },

    loadSettings: {
        value: function() {
        }
    },

    ntpSyncNow: {
        value: function(address) {
            var self = this;
            return this._ntpServerServices.then(function(ntpServerServices) {
                return ntpServerServices.syncNow(address);
            });
        }
    },

});
