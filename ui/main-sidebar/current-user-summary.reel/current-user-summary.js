var Component = require("montage/ui/component").Component,
    SystemService = require("core/service/system-service").SystemService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name.js").ModelEventName,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient;

exports.CurrentUserSummary = Component.specialize({

    dotRegEx: {
        value: /\./g
    },

    datePattern: {
        value: "M/d/yy"
    },

    timePattern: {
        value: "T"
    },

    _synchronizeClockTimeoutId: {
        value: null
    },

    _synchronizeClockIntervalId: {
        value: null
    },

    _intervalTime: {
        value: 10 // sec
    },

    eventDispatcherService: {
        get: function() {
            if (!this._eventDispatcherService) {
                this._eventDispatcherService = EventDispatcherService.getInstance();
            }
            return this._eventDispatcherService;
        }
    },

    _sessionDidOpen: {
        value: false
    },

    _loadUserSettings: {
        value: function(user) {
            if (user.attributes.userSettings) {
                this.datePattern = user.attributes.userSettings.dateFormatShort || this.datePattern;
                this.timePattern = user.attributes.userSettings.timeFormatLong || this.timePattern;
            }
        }
    },

    _handleOpenedSession: {
        value: function() {
            var self = this;
            this.application.accountsService.findUserWithName(this.middlewareClient.user).then(function(user) {
                self._loadUserSettings(user);
                self.userPreferencesEventListener = self.eventDispatcherService.addEventListener(ModelEventName.User.change(user.id), self._handleUserChange.bind(self));
            });
            this._sessionDidOpen = true;
        }
    },

    _handleUserChange: {
        value: function(user) {
            this._loadUserSettings(user.toJS());
        }
    },

    templateDidLoad: {
        value: function() {
            this.middlewareClient = MiddlewareClient.getInstance();
            this.systemService = SystemService.getInstance();
            this.eventDispatcherService.addEventListener("SessionOpened", this._handleOpenedSession.bind(this));
        }
    },

    _loadTime: {
        value: function() {
            var self = this;
            return this._sessionDidOpen ?
                self.systemService.getTime().then(function (time) {
                    return new Date(time.system_time.$date);
                }) :
                Promise.resolve(new Date());
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {

                // Bind a function in order to avoid to create several time this function.
                this._timeChangetimeoutCallBack = (function (initial) {
                    var self = this;
                    this._loadTime().then(function (now) {
                        var seconds = now.getSeconds(),
                            timeLag = seconds % self._intervalTime;

                        now.setSeconds(seconds + (
                            initial ? -timeLag : timeLag > self._intervalTime / 2 ? self._intervalTime - timeLag : -timeLag
                        ));
                        now.setMilliseconds(0);

                        self.now = now.getTime();
                    });
                }).bind(this);
            }
            this._synchronizeTime();
        }
    },

    exitDocument: {
        value: function () {
            if (this._synchronizeClockTimeoutId) {
                clearTimeout(this._synchronizeClockTimeoutId);
                this._synchronizeClockTimeoutId = null;
            }

            if (this._synchronizeClockIntervalId) {
                clearInterval(this._synchronizeClockIntervalId);
                this._synchronizeClockIntervalId = null;
            }
        }
    },

    _synchronizeTime: {
        value: function () {
            var now = new Date(),
                timeRemainingBeforeSync = ((this._intervalTime - (now.getSeconds() % this._intervalTime)) * 1000) - now.getMilliseconds();

            this._timeChangetimeoutCallBack(true);

            if (timeRemainingBeforeSync === this._intervalTime * 1000) {
                this._setIntervalTime();

            } else {
                var self = this;
                this._synchronizeClockTimeoutId = setTimeout(function () {
                    self._timeChangetimeoutCallBack();
                    self._setIntervalTime();
                }, timeRemainingBeforeSync);
            }
        }
    },

    _setIntervalTime: {
        value: function () {
            this._synchronizeClockIntervalId = setInterval(this._timeChangetimeoutCallBack, this._intervalTime * 1000);
        }
    }

});
