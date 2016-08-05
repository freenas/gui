var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    WidgetService = require("core/service/widget-service").WidgetService,
    Promise = require("montage/core/promise").Promise;


var ApplicationContextService = exports.ApplicationContextService = Montage.specialize({

    save: {
        value: function () {
            var saveContextPromise;

            if (this._saveContextPromise) {
                saveContextPromise = this._saveContextPromise;

            } else {
                var self = this,
                    constructor = this.constructor;

                this._saveContextPromise = this._saveContextPromise = new Promise(function (resolve, reject) {
                    resolve(self.findCurrentUser().then(function (user) {
                        user.attributes = constructor.applicationContext;

                        return self._dataService.saveDataObject(user);
                    }));
                }).then(function () {
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

            if (this.constructor.applicationContext) {
                getContextPromise = Promise.resolve(this.constructor.applicationContext);

            } else if (this._getContextPromise) {
                getContextPromise = this._getContextPromise;

            } else {
                var self = this,
                    constructor = this.constructor;

                getContextPromise = this._getContextPromise = new Promise(function (resolve, reject) {
                    var applicationContext;

                    if (self._dataService) {
                        applicationContext = self.findCurrentUser().then(function (user) {
                            if (user.attributes && user.attributes.dashboardContext) {
                                return self._populateWidgetToApplicationContext(user.attributes);
                            }

                            return self._getDefaultApplicationContext();
                        });

                    } else {
                        applicationContext = self._getDefaultApplicationContext();
                    }

                    resolve(applicationContext);

                }).then(function (applicationContext) {
                    self._getContextPromise = null;

                    return (constructor.applicationContext = applicationContext);
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
            var sessionUsername = application.session.username;

            if (sessionUsername) {
                if (this._currentUser && this._currentUser.username === sessionUsername) {
                    return Promise.resolve(this._currentUser);
                }

                this._currentUser = null;

                var self = this;

                return this._dataService.fetchData(Model.User).then(function (users) {
                    for (var i = 0, length = users.length; i < length; i++) {
                        if (users[i].username === sessionUsername) {
                            self._currentUser = users[i];
                            break;
                        }
                    }

                    return self._currentUser;
                });
            }

            return Promise.reject("not logged");
        }
    },

    _getDefaultApplicationContext: {
        value: function () {
            var self = this;

            return this._widgetService.getAvailableWidgets().then(function (widgets) {
                return self._dataService.getNewInstanceForType(Model.ApplicationContext).then(function (applicationContext) {
                    return Promise.all([
                        self._dataService.getNewInstanceForType(Model.DashboardContext),
                        self._dataService.getNewInstanceForType(Model.SideBarContext)
                    ]).then(function (models) {
                        applicationContext.dashboardContext = models[0];
                        applicationContext.sideBarContext = models[1];
                        applicationContext.dashboardContext.widgets = [widgets.get("system-info")];
                        applicationContext.sideBarContext.widgets = [];

                        return applicationContext;
                    });
                });
            });
        }
    },

    _populateWidgetToApplicationContext: {
        value: function (applicationRawContext) {
            var self = this;



            return this._widgetService.getAvailableWidgets().then(function (widgets) {
                self._findWidgetsFromAvailableWidgets(applicationRawContext.dashboardContext.widgets, widgets);
                self._findWidgetsFromAvailableWidgets(applicationRawContext.sideBarContext.widgets, widgets);
                debugger
                return applicationRawContext;
            });
        }
    },

    _findWidgetsFromAvailableWidgets: {
        value: function (rawWidgets, availableWidgets) {
            var widget;

            for (var i = 0, length = rawWidgets.length; i < length; i++) {
                widget = this._findWidgetFromAvailableWidgetsWithTitle(availableWidgets, rawWidgets[i].title);

                if (widget) {
                    rawWidgets.splice(i, 1, widget);
                } else {
                    console.warn("no widget found for: " + rawWidgets[i].title);
                }
            }

            return rawWidgets;
        }
    },

    _findWidgetFromAvailableWidgetsWithTitle: {
        value: function (availableWidgets, title) {
            var mapIterator = availableWidgets.keys(),
                key;

            while ((key = mapIterator.next().value)) {
                if (key === title) {
                    return availableWidgets.get(key);
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
            }

            return this._instance;
        }
    }

});
