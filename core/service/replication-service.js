var Montage = require("montage").Montage
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var ReplicationService = exports.ReplicationService = Montage.specialize({
    _replicationLinks: {
        value: null
    },

    _replicationLinksPromise: {
        value: null
    },

    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
        }
    },

    listReplicationLinks: {
        value: function() {
            if (this._replicationLinks) {
                return Promise.resolve(this._replicationLinks);
            } else if (this._replicationLinksPromise) {
                return this._replicationLinksPromise;
            } else {
                var self = this;
                return this._replicationLinksPromise = this._dataService.fetchData(Model.ReplicationLink).then(function(replicationLinks) {
                    return self._replicationLinks = replicationLinks;
                });
            }
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

