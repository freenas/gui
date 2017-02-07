var Montage = require("montage").Montage,
    AlertRepository = require("core/repository/alert-repository").AlertRepository,
    AlertFilterRepository = require("core/repository/alert-filter-repository").AlertFilterRepository;

exports.AlertService = Montage.specialize({
    constructor: {
        value: function () {
            this._alertRepository = AlertRepository.getInstance();
            this._alertFilterRepository = AlertFilterRepository.getInstance();
        }
    },

    loadEntries: {
        value: function () {
            return this._alertFilterRepository.listAlertFilters();
        }
    },

    listAlertClasses: {
        value: function () {
            return this._alertRepository.listAlertClasses();
        }
    },

    listAlertSeverities: {
        value: function () {
            return this._alertRepository.listAlertSeverities();
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
