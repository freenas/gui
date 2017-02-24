var Component = require("montage/ui/component").Component,
    SystemService = require("core/service/system-service").SystemService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name.js").ModelEventName,
    Events = require('core/Events').Events,
    moment = require('moment-timezone'),
    _ = require('lodash');

exports.CurrentUserSummary = Component.specialize({
    _intervalTimeInSec: {
        value: 10
    },

    _updatePerSec: {
        value: 2
    },

    datePattern: {
        value: SystemService.SHORT_DATE_FORMATS[0]
    },

    timePattern: {
        value: SystemService.MEDIUM_TIME_FORMATS[0]
    },

    _timeUpdateIntervalId: {
        value: null
    },

    _localUpdatesCount: {
        value: -1
    },

    _remoteTimePromise: {
        value: null
    },

    timezone: {
        value: "America/Los Angeles"
    },

    templateDidLoad: {
        value: function() {
            this.eventDispatcherService = EventDispatcherService.getInstance();
            this.systemService = SystemService.getInstance();
            this.eventDispatcherService.addEventListener(Events.sessionOpened, this._handleOpenedSession.bind(this));
            this.now = new Date();
            this._updatePeriod = 1000 / this._updatePerSec;
        }
    },

    enterDocument: {
        value: function () {
        }
    },

    exitDocument: {
        value: function () {
            if (this._timeUpdateIntervalId) {
                clearInterval(this._timeUpdateIntervalId);
                this._timeUpdateIntervalId = null;
            }
        }
    },

    _loadUserSettings: {
        value: function(user) {
            if (user.attributes.userSettings) {
                if (_.includes(SystemService.SHORT_DATE_FORMATS, user.attributes.userSettings.dateFormatShort)) {
                    this.datePattern = user.attributes.userSettings.dateFormatShort || this.datePattern;
                }
                if (_.includes(SystemService.MEDIUM_TIME_FORMATS, user.attributes.userSettings.timeFormatMedium)) {
                    this.timePattern = user.attributes.userSettings.timeFormatMedium || this.timePattern;
                }
            }
        }
    },

    _handleOpenedSession: {
        value: function(session) {
            var self= this;
            this.user = session.user.username;
            this.url = session.url;
            this._loadUserSettings(session.user);
            this._startTimeUpdate();
            this.systemService.getGeneral().then(function(systemGeneral) {
                self.timezone = systemGeneral.timezone;
            });
            this.eventDispatcherService.addEventListener(ModelEventName.User.change(session.user.id), this._handleUserChange.bind(this));
            //fixme: this should work, just needs to be fixed since SystemGeneral doesn't have an id
            //this.eventDispatcherService.addEventListener(ModelEventName.SystemGeneral.change(), this._handleSystemGeneralChange.bind(this));
        }
    },

    _handleUserChange: {
        value: function(user) {
            this._loadUserSettings(user.toJS());
        }
    },

    //_handleSystemGeneralChange: {
    //    value: function(general) {
    //        fixme: need a fix to handle system general updates to update timezone
    //    }
    //},

    _startTimeUpdate: {
        value: function() {
            this._timeUpdateIntervalId = setInterval(this._updateTime.bind(this), this._updatePeriod);
        }
    },

    _updateTime: {
        value: function() {
            var self = this;
            if (!this._remoteTimePromise) {
                if (++this._localUpdatesCount % (this._intervalTimeInSec * this._updatePerSec) === 0) {
                    this._remoteTimePromise = this.systemService.getTime().then(function(time) {
                        self.now = new Date(time.system_time.$date);
                        self._remoteTimePromise = null;
                        self._localUpdatesCount = 0;
                    });
                } else {
                    this.now = moment(this.now).add(this._updatePeriod, 'ms').toDate();
                }
                this.date = moment(this.now).tz(this.timezone).format(this.datePattern);
                this.time = moment(this.now).tz(this.timezone).format(this.timePattern);
            }
        }
    }
});
