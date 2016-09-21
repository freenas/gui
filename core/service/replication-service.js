var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var ReplicationService = exports.ReplicationService = Montage.specialize({
    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
        }
    },

    listReplications: {
        value: function() {
            return this._dataService.fetchData(Model.Replication).then(function (replications) {
                return replications;
            });
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ReplicationService();
            }
            return this._instance;
        }
    }
});
