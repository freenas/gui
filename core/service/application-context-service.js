var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    AccountRepository = require("core/repository/account-repository").AccountRepository,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    WidgetService = require("core/service/widget-service").WidgetService,
    Promise = require("montage/core/promise").Promise;


var ApplicationContextService = exports.ApplicationContextService = Montage.specialize({

    constructor: {
        value: function () {
            application.addEventListener("userLogged", this, false);
        }
    },

    handleUserLogged: {
        value: function () {
            var self = this;

            window.nativeAddEventListener("beforeunload", function () {
                self.save();
            });
        }
    },

    save: {
        value: function () {
            var saveContextPromise;

            if (this._saveContextPromise) {
                saveContextPromise = this._saveContextPromise;
            } else {
                var self = this;

                return (this._saveContextPromise = this._saveContextPromise = self.findCurrentUser().then(function (user) {
                    return self._accountRepository.saveUser(user);
                })).finally(function () {
                    self._saveContextPromise = null;
                });
            }

            return saveContextPromise;
        }
    },

    restoreDefaultApplicationContext: {
        value: function () {
            var self = this;

            return this._getDefaultApplicationContext().then(function (applicationContext) {
                return (self._currentUser.attributes = applicationContext);
            }).then(function () {
                return self.save();
            });
        }
    },

    findCurrentUser: {
        value: function () {
            var sessionUsername = application.sessionService.session.username,
                self = this,
                currentUser;

            if (sessionUsername) {
                if (this._currentUser && this._currentUser.username === sessionUsername) {
                    return Promise.resolve(this._currentUser);
                }

                this._currentUser = null;

                return this._accountRepository.findUserWithName(sessionUsername).then(function (user) {
                    currentUser = user;

                    if (user.attributes && user.attributes.dashboardContext) {
                        return user.attributes;
                    }

                    return self._getDefaultApplicationContext();
                }).then(function (applicationContext) {
                    currentUser.attributes = applicationContext;
                    self.addPathChangeListener("_currentUser.attributes", self, "_repairApplicationRawContextIfNeeded");

                    return (self._currentUser = currentUser);
                });
            }

            return Promise.reject("not logged");
        }
    },

    _getDefaultApplicationContext: {
        value: function () {
            if (this._widgetService) {
                var self = this;

                return this._widgetService.getAvailableWidgets().then(function (widgets) {
                    return self._dataService.getNewInstanceForType(Model.ApplicationContext).then(function (applicationContext) {
                        applicationContext.dashboardContext = {};
                        applicationContext.sideBoardContext = {};
                        applicationContext.userSettings = {};
                        applicationContext.dashboardContext.widgets = [widgets.get("ui/widgets/system-info.reel")];
                        applicationContext.sideBoardContext.widgets = [
                            widgets.get("ui/widgets/alerts.reel"),
                            widgets.get("ui/widgets/tasks.reel")
                        ];

                        return applicationContext;
                    });
                });
            }
        }
    },

    _repairApplicationRawContextIfNeeded: {
        value: function (applicationRawContext) {
            if (applicationRawContext) {                
                if (!applicationRawContext.dashboardContext || typeof applicationRawContext.dashboardContext !== "object") {
                    applicationRawContext.dashboardContext = {};
                }

                if (!applicationRawContext.sideBoardContext || typeof applicationRawContext.sideBoardContext !== "object") {
                    applicationRawContext.sideBoardContext = {};
                }

                if (!applicationRawContext.userSettings || typeof applicationRawContext.userSettings !== "object") {
                    applicationRawContext.userSettings = {};
                }

                if (!Array.isArray(applicationRawContext.dashboardContext.widgets)) {
                    applicationRawContext.dashboardContext.widgets = [];
                }

                if (!Array.isArray(applicationRawContext.sideBoardContext.widgets)) {
                    applicationRawContext.sideBoardContext.widgets = [];
                }
            }
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ApplicationContextService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._widgetService = WidgetService.instance;
                this._instance._accountRepository = AccountRepository.getInstance();
            }

            return this._instance;
        }
    }

});
