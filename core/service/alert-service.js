var Montage = require("montage").Montage,
    AlertRepository = require("core/repository/alert-repository").AlertRepository;

exports.AlertService = Montage.specialize({
    constructor: {
        value: function () {
            this._alertRepository = AlertRepository.instance;
        }
    },

    loadEntries: {
        value: function () {
            return this._alertRepository.listAlertFilters();
        }
    },

    loadSettings: {
        value: function () {
            return this._alertRepository.getMail();
        }
    }

}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new this();
            }
            return this._instance;
        }
    }
});
