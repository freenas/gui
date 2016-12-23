var Component = require("montage/ui/component").Component,
    SystemService = require("core/service/system-service").SystemService,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient;

exports.CurrentUserSummary = Component.specialize({

    dotRegEx: {
        value: /\./g
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

    templateDidLoad: {
        value: function() {
            this.middlewareClient = MiddlewareClient.getInstance();
            this.systemService = SystemService.getInstance();
        }
    },

    _loadTime: {
        value: function() {
            var self = this;
            return this.application.sessionService.session.username ?
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

            //Set initial time.
            this._timeChangetimeoutCallBack(true);

            if (timeRemainingBeforeSync === this._intervalTime * 1000) { // clock already synchronized with the interval set.
                this._setIntervalTime();

            } else { // need to be synchronized.
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
