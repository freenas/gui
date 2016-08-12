var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
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
                    return self._dataService.saveDataObject(user);
                })).finally(function () {
                    self._saveContextPromise = null;
                });
            }

            return saveContextPromise;
        }
    },

    //restore?
    get: {
        value: function () {
            var getContextPromise;

            if (this._currentUser && this._currentUser.attributes) {
                getContextPromise = Promise.resolve(this._currentUser.attributes);

            } else if (this._getContextPromise) {
                getContextPromise = this._getContextPromise;

            } else {
                var self = this;

                getContextPromise = this._getContextPromise = self.findCurrentUser().then(function (user) {
                    return user.attributes;
                }).finally(function () {
                    self._getContextPromise = null;
                });
            }

            return getContextPromise;
        }
    },

    //@todo
    revert: {
        value: function () {
            this.constructor.applicationContext = null;

            return this.get();
        }
    },

    //TODO: session service?
    findCurrentUser: {
        value: function () {
            var sessionUsername = application.session.username,
                self = this,
                currentUser;

            if (sessionUsername) {
                if (this._currentUser && this._currentUser.username === sessionUsername) {
                    return Promise.resolve(this._currentUser);
                }

                this._currentUser = null;

                return this._dataService.fetchData(Model.User).then(function (users) {
                    for (var i = 0, length = users.length; i < length; i++) {
                        if (users[i].username === sessionUsername) {
                            return users[i];
                        }
                    }
                }).then(function (user) {
                    currentUser = user;

                    if (user.attributes && user.attributes.dashboardContext) {
                        return user.attributes;
                    }

                    return self._getDefaultApplicationContext();
                }).then(function (applicationContext) {
                    currentUser.attributes = applicationContext;
                    self.addPathChangeListener("_currentUser.attributes", self, "_handleRawApplicationContext");

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
                        return Promise.all([
                            self._dataService.getNewInstanceForType(Model.DashboardContext),
                            self._dataService.getNewInstanceForType(Model.sideBoardContext)
                        ]).then(function (models) {
                            applicationContext.dashboardContext = models[0];
                            applicationContext.sideBoardContext = models[1];
                            applicationContext.dashboardContext.widgets = [widgets.get("ui/widgets/system-info.reel")];
                            applicationContext.sideBoardContext.widgets = [
                                widgets.get("ui/widgets/alerts.reel"),
                                widgets.get("ui/widgets/tasks.reel")
                            ];

                            return applicationContext;
                        });
                    });
                });
            }
        }
    },

    _handleRawApplicationContext: {
        value: function (applicationRawContext) {
            if (applicationRawContext) {
                if (!applicationRawContext.sideBoardContext) {
                    applicationRawContext.sideBoardContext = {};
                }

                //@fixme: remove for beta
                if (!applicationRawContext.sideBarContext) {
                    delete applicationRawContext.sideBarContext;
                }

                applicationRawContext.dashboardContext.widgets = applicationRawContext.dashboardContext.widgets || [];
                applicationRawContext.sideBoardContext.widgets = applicationRawContext.sideBoardContext.widgets || [];
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
            }

            return this._instance;
        }
    }

});
