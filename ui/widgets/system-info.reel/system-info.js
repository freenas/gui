var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class SystemInfo
 * @extends Component
 */
exports.SystemInfo = Component.specialize({
    systemInfo: {
        value: null
    },

    constructor: {
        value: function() {
            this._systemInfoService = this.application.systemInfoService;
            this._dataService = this.application.dataService;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            var self = this;

            if (firstTime) {
                this._fetchSystemInfo();
            }

            return this._loadTime().then(this._startTimer.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._stopTimer();
        }
    },

    _fetchSystemInfo: {
        value: function() {
            var self = this;
            this.systemInfo = {};

            this._loadVersion().then(function(version) {
                self.systemInfo.version = version;
                return self._loadHardware();
            }).then(function(hardware) {
                self.systemInfo.hardware = hardware;
                return self._loadSystemGeneral();
            }).then(function(general) {
                self.systemInfo.general = general;
                return self._loadDisks();
            }).then(function(disks) {
                self.systemInfo.disks = disks;
                return self._loadLoad();
            }).then(function(load) {
                self.systemInfo.load = load;
                return self._loadHardwareCapabilities();
            }).then(function(vm) {
                self.systemInfo.vmSupport = vm.vtx_enabled ?
                    vm.unrestricted_guest ? "Full" : "Partial" :
                    vm.svm_features ? "Partial" : "None";
            });
        }
    },

    _loadVersion: {
        value: function() {
            return this._systemInfoService.getVersion();
        }
    },

    _loadHardware: {
        value: function() {
            return this._systemInfoService.getHardware();
        }
    },

    _loadSystemGeneral: {
        value: function() {
            return this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                return systemGeneral[0];
            });
        }
    },

    _loadTime: {
        value: function() {
            return this.application.systemTimeService.getCurrentSystemTime();
        }
    },

    _loadDisks: {
        value: function() {
            return this._dataService.fetchData(Model.Disk);
        }
    },

    _loadLoad: {
        value: function() {
            return this.application.systemInfoService.getLoad();
        }
    },

    _loadHardwareCapabilities: {
        value: function() {
            return this.application.virtualMachineService.getHardwareCapabilities();
        }
    },

    _startTimer: {
        value: function(time) {
            var self = this,
                startTime = new Date().getTime(),
                startSystemTime = new Date(time.system_time['$date']).getTime();

            this._stopTimer();
            this._timer = setInterval(function () {
                var elapsed = new Date().getTime() - startTime;
                self.systemInfo.time = {
                    uptime: time.uptime + elapsed / 1000,
                    system_time: new Date(startSystemTime + elapsed).toISOString()
                };
            }, 1000);
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
