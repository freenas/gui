var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    TopologyService = require("core/service/topology-service").TopologyService,
    SystemGeneralService = require("core/service/system-general-service").SystemGeneralService,
    Model = require("core/model/model").Model;

var SessionService = exports.SessionService = Montage.specialize({

    session: {
        value: null
    },

    sessionDidOpen: {
        value : function(username) {
            var self = this;
            this.session = {};
            this._topologyService.loadVdevRecommendations();
            this.session.username = username;
            this.session.host = this._dataService.host;

            return this._dataService.fetchData(Model.Service).then(function(services) {
                return Promise.all(services.map(function(x) {
                    return Promise.resolve(x.config).then(function() {
                        return x;
                    });
                }));
            });
        }
    },

    _getTimeWithUserTimezone: {
        value: function() {
            var dateWithTimezone = new Date(new Date().toLocaleString('en-US', { timeZone: this.session.timezone }));
        }
    },

    _addUserTimezoneToSession: {
        value: function() {
            var self = this;
            return this._systemGeneralService.getSystemGeneralData().then(function(systemGeneral) {
                self.session.timezone = systemGeneral.timezone;
            });
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SessionService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._topologyService = TopologyService.instance;
                this._instance._systemGeneralService = SystemGeneralService.instance;
            }
            return this._instance;
        }
    }
});
