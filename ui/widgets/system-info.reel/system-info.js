var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

exports.SystemInfo = Component.specialize({
    systemInfo: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            this._systemService = this.application.systemService;
            this._dataService = this.application.dataService;

            this.systemInfo = {};

            this._systemService.getVersion().then(function(version) {
                self.systemInfo.version = version;
                return self._systemService.getHardware();
            }).then(function(hardware) {
                self.systemInfo.hardware = hardware;
                return self._systemService.getGeneral();
            }).then(function(general) {
                self.systemInfo.general = general;
                return self._loadDisks();
            }).then(function(disks) {
                self.systemInfo.disks = disks;
                return self._systemService.getLoad();
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

    enterDocument: {
        value: function (firstTime) {
            return self._systemService.getTime().then(this._startTime.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._stopTimer();
        }
    },

    _loadDisks: {
        value: function() {
            return this._dataService.fetchData(Model.Disk);
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
