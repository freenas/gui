var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SessionService = exports.SessionService = Montage.specialize({

    sessionDidOpen: {
        value : function() {
            if (!this._isAuthenticating && this.userName && this.password) {
                var self = this;
                this.isAuthenticating = true;
                this.errorMessage = null;

                this.dataService.loginWithCredentials(this.userName, this.password).then(function (authorization) {
                    self.application.topologyService.loadVdevRecommendations();
                    self.application.session.username = self.userName;
                    self.application.session.host = self.application.dataService.host;

                    // Don't keep any track of the password in memory.
                    self.password = self.userName = null;

                    //FIXME: kind of hacky
                    self.application.dispatchEventNamed("userLogged");

                    self.application.section = self._getSection();

                    return self.application.dataService.fetchData(Model.Service).then(function(services) {
                        return Promise.all(services.map(function(x) { return Promise.resolve(x.config).then(function() { return x; }); }));
                    });
                }, function (error) {
                    self.errorMessage = error.message || error;
                }).finally(function () {
                    if (self.errorMessage) {
                        self.element.addEventListener(
                            typeof WebKitAnimationEvent !== "undefined" ? "webkitAnimationEnd" : "animationend", self, false
                        );
                    }

                    self.isAuthenticating = false;
                });
            }
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SessionService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
