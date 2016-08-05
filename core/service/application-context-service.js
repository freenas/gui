var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    WidgetService = require("core/service/widget-service").WidgetService,
    ApplicationContext = require("core/application-context").ApplicationContext,
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
                    var promise;

                    //FIXME: @pierre freenas-service L277 self._selectionService.saveTaskSelection(taskId, object);??
                    if (self._dataService && false) { //experimental
                        promise = self.findCurrentUser().then(function (user) {
                            user.attributes = constructor.applicationContext;

                            self._dataService.saveDataObject(user).then(function () {
                                return self._saveApplicationContextLocally(constructor.applicationContext);
                            });
                        });
                    } else {
                        promise = self._saveApplicationContextLocally(constructor.applicationContext);
                    }

                    resolve(promise);

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

                    if ((applicationContext = localStorage.getItem(constructor.LOCAL_STORAGE_KEY))) {
                        applicationContext = ApplicationContext.FromJSON(applicationContext);

                    } else if (self._dataService) {
                        applicationContext = self.findCurrentUser().then(function (user) {
                            if (user.attributes && user.attributes.dashboardContext) {
                                return ApplicationContext.FromJSON(applicationContext);
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
            return this._widgetService.getAvailableWidgets().then(function (widgets) {
                var applicationContext = new ApplicationContext();
                applicationContext.dashboardContext.widgets.push(widgets.get("system-info"));

                return applicationContext;
            });
        }
    },


    //TODO: throw an error?
    _saveApplicationContextLocally: {
        value: function () {
            var applicationContextJSON = JSON.stringify(this.constructor.applicationContext);
            return localStorage.setItem(this.constructor.LOCAL_STORAGE_KEY, applicationContextJSON);
        }
    }

}, {

    LOCAL_STORAGE_KEY: {
        value: 'gui-application-context'
    },

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
