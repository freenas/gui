var Montage = require("montage").Montage,
    ApplicationContext = require("core/application-context").ApplicationContext;


var ApplicationContextService = exports.ApplicationContextService = Montage.specialize({

    save: {
        value: function () {
            var saveContextPromise;

            if (this._saveContextPromise) {
                saveContextPromise = this._saveContextPromise;

            } else {
                var self = this,
                    constructor = this.constructor;

                this._saveContextPromise = new Promise(function (resolve, reject) {
                    var applicationContextJSON = JSON.stringify(constructor.applicationContext);

                    if (this._dataSevice) { //TODO
                        //applicationContextJSON = this._dataSevice.
                    } else {
                        localStorage.setItem(constructor.LOCAL_STORAGE_KEY, applicationContextJSON);
                    }

                    resolve(applicationContextJSON);

                }).then(function () {
                    self._getContextPromise = null;
                });
            }

            return (this._saveContextPromise = saveContextPromise);
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

                getContextPromise = new Promise(function (resolve, reject) {
                    var applicationContext;

                    if ((applicationContext = localStorage.getItem(constructor.LOCAL_STORAGE_KEY))) {
                        applicationContext = ApplicationContext.FromJSON(applicationContext);

                    } else if (this._dataSevice) { //TODO
                        //applicationContext = this._dataSevice.

                    } else {
                        applicationContext = new ApplicationContext();
                    }

                    resolve(applicationContext);

                }).then(function () {
                    self._getContextPromise = null;
                });
            }

            return (this._getContextPromise = getContextPromise);
        }
    },

    //@todo
    revert: {
        value: function () {
            this.constructor.applicationContext = null;

            return this.get();
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
            }

            return this._instance;
        }
    }

});
