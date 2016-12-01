var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    TopologyService = require("core/service/topology-service").TopologyService,
    SystemGeneralService = require("core/service/system-general-service").SystemGeneralService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    MiddlewareClient = require('core/service/middleware-client').MiddlewareClient;
    Model = require("core/model/model").Model;

var SessionService = exports.SessionService = Montage.specialize({

    session: {
        value: null
    },

    sessionDidOpen: {
        value : function(username) {
            var self = this;
            this.session = {};
            this.session.username = username;
            this.session.host = this._dataService.host;
            this._dataService.subscribeToEvents('entity-subscriber.task.changed', Model.Task);

            return Promise.all([
//                this._dataService.fetchData(Model.Task),
                this._dataService.fetchData(Model.Alert),
                this._dataService.fetchData(Model.Service).then(function(services) {
                    return Promise.all(services.map(function(x) {
                        return Promise.resolve(x.config).then(function() {
                            return x;
                        });
                    }));
                })
            ]);
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
            return this._systemGeneralService.getSystemGeneral().then(function(systemGeneral) {
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
                this._instance._middlewareClient = MiddlewareClient.getInstance();
                this._instance._eventDispatcherService = EventDispatcherService.getInstance();
            }
            return this._instance;
        }
    }
});
