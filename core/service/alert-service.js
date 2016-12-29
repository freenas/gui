var Montage = require("montage").Montage,
    AlertFilterRepository = require("core/repository/alert-filter-repository").AlertFilterRepository;

exports.AlertService = Montage.specialize({
    constructor: {
        value: function () {
            this._alertFilterRepository = AlertFilterRepository.instance;
        }
    },

    loadEntries: {
        value: function () {
            return this._alertFilterRepository.listAlertFilters();
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
