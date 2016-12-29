var Montage = require("montage").Montage,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    ServiceRepository = require("core/repository/service-repository").ServiceRepository;

var SessionService = exports.SessionService = Montage.specialize({

    session: {
        value: null
    },

    sessionDidOpen: {
        value : function(username) {
            this.session = {};
            this.session.username = username;

            return this._serviceRepository.listServices()
/*
                .then(function(services) {
                return Promise.all(services.map(function(x) {
                    return Promise.resolve(x.config).then(function() { return x; });
                }));
            })
*/
                ;
        }
    },

    _addUserTimezoneToSession: {
        value: function() {
            var self = this;
            return this._systemRepository.getGeneral().then(function(systemGeneral) {
                self.session.timezone = systemGeneral.timezone;
            });
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SessionService();
                this._instance._systemRepository = SystemRepository.getInstance();
                this._instance._serviceRepository = ServiceRepository.getInstance();
            }
            return this._instance;
        }
    }
});
