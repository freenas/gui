var Montage = require("montage").Montage,
    AccountRepository = require("core/repository/account-repository").AccountRepository,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    WidgetService = require("core/service/widget-service").WidgetService,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    Events = require('core/Events').Events;


var ApplicationContextService = exports.ApplicationContextService = Montage.specialize({

    constructor: {
        value: function () {
            application.addEventListener("userLogged", this, false);
        }
    },

    handleUserLogged: {
        value: function () {
            var self = this;
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
            var self = this;
            return (this._currentUser && this._currentUser.username === sessionUsername) ?
                Promise.resolve(this._currentUser) :
                this._currentUserPromise.then(function (user) {
                    currentUser = user;

                    if (user.attributes && user.attributes.dashboardContext) {
                        return self._widgetService.getAvailableWidgets().then(function(widgets) {
                            user.attributes.dashboardContext.widgets = (user.attributes.dashboardContext.widgets || []).filter(function(widget) {
                                return !!widgets.get(widget.moduleId);
                            });
                            if (user.attributes.sideBoardContext) {
                                user.attributes.sideBoardContext.widgets = (user.attributes.sideBoardContext.widgets || []).filter(function(widget) {
                                    return !!widgets.get(widget.moduleId);
                                });
                            }
                            return user.attributes;
                        });
                    }

                    return self._getDefaultApplicationContext();
                }).then(function (applicationContext) {
                    currentUser.attributes = applicationContext;
                    self.addPathChangeListener("_currentUser.attributes", self, "_repairApplicationRawContextIfNeeded");

                    return self._currentUser = currentUser;
                });
        }
    },

    _getDefaultApplicationContext: {
        value: function () {
            if (this._widgetService) {
                return this._widgetService.getAvailableWidgets().then(function (widgets) {
                    var applicationContext = {};
                    applicationContext.dashboardContext = {};
                    applicationContext.sideBoardContext = {};
                    applicationContext.userSettings = {};
                    applicationContext.dashboardContext.widgets = [
                        widgets.get("ui/widgets/system-info.reel")
                    ];
                    applicationContext.sideBoardContext.widgets = [
                        widgets.get("ui/widgets/alerts.reel"),
                        widgets.get("ui/widgets/tasks.reel")
                    ];

                    return applicationContext;
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
                this._instance._currentUserPromise = new Promise(function(resolve) {
                    EventDispatcherService.getInstance().addEventListener(Events.sessionOpened, function(session) {
                        resolve(session.user);
                    });
                });
            }

            return this._instance;
        }
    }

});
