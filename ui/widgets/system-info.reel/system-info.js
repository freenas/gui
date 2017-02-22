var Component = require("montage/ui/component").Component,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    DiskRepository = require("core/repository/disk-repository").DiskRepository,
    SystemService = require("core/service/system-service").SystemService,
    SessionService = require('core/service/SessionService').SessionService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name.js").ModelEventName,
    Events = require('core/Events').Events,
    moment = require("moment"),
    _ = require('lodash');

exports.SystemInfo = Component.specialize({
    systemInfo: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this.eventDispatcherService = EventDispatcherService.getInstance();

            this._systemService = SystemService.getInstance();
            this._vmRepository = VmRepository.getInstance();
            this._diskRepository = DiskRepository.getInstance();
            this.sessionService = SessionService.getInstance();

            this._dataPromise = Promise.all([
                this._systemService.getVersion(),
                this._systemService.getHardware(),
                this._systemService.getGeneral(),
                this._diskRepository.listDisks(),
                this._systemService.getLoad(),
                this._vmRepository.getHardwareCapabilities()
            ]).spread(function (version, hardware, general, disks, load, vm) {
                self.systemInfo = {
                    version: version,
                    hardware: hardware,
                    general: general,
                    disks: disks,
                    load: load,
                    vmSupport: vm.vtx_enabled ?
                        vm.unrestricted_guest ? "Full" : "Partial" :
                        vm.svm_features ? "Partial" : "None"
                };
            })
        }
    },

    enterDocument: {
        value: function () {
            var self = this,
                user = this.sessionService.session.user;
            this.eventDispatcherService.addEventListener(ModelEventName.User.change(user.id), this._handleUserChange.bind(this));
            this._loadUserSettings(user);
            return Promise.all([
                this._systemService.getTime(),
                this._dataPromise
            ]).spread(function(time) {
                return self._startTimer(time);
            });
        }
    },

    exitDocument: {
        value: function() {
            this._stopTimer();
        }
    },

    _loadUserSettings: {
        value: function(user) {
            if (user.attributes.userSettings && _.includes(SystemService.LONG_TIME_FORMATS, user.attributes.userSettings.timeFormatLong)) {
                this.datePattern = user.attributes.userSettings.dateFormatLong || this.datePattern;
                this.timePattern = user.attributes.userSettings.timeFormatLong || this.timePattern;
            }
        }
    },

    _handleUserChange: {
        value: function(user) {
            this._loadUserSettings(user.toJS());
        }
    },

    _startTimer: {
        value: function(time) {
            var self = this,
                startTime = new Date().getTime(),
                startSystemTime = +(moment(time.system_time['$date']).format("X"));

            this._stopTimer();
            this._timer = setInterval(function () {
                var elapsed = new Date().getTime() - startTime;
                self.systemInfo.time = {
                    uptime: time.uptime + elapsed / 1000,
                    system_time: new Date(startSystemTime * 1000 + elapsed)
                };
            }, 500);
        }
    },

    _stopTimer: {
        value: function() {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = 0;
            }
        }
    }

});
