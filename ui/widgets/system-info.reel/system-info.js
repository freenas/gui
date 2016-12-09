var Component = require("montage/ui/component").Component,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    DiskRepository = require("core/repository/disk-repository").DiskRepository,
    SystemService = require("core/service/system-service").SystemService;

exports.SystemInfo = Component.specialize({
    systemInfo: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            this._systemService = SystemService.getInstance();
            this._vmRepository = VmRepository.instance;
            this._diskRepository = DiskRepository.getInstance();

            this.systemInfo = {};

            this._systemService.getVersion().then(function(version) {
                self.systemInfo.version = version;
                return self._systemService.getHardware();
            }).then(function(hardware) {
                self.systemInfo.hardware = hardware;
                return self._systemService.getGeneral();
            }).then(function(general) {
                self.systemInfo.general = general;
                return self._diskRepository.listDisks();
            }).then(function(disks) {
                self.systemInfo.disks = disks;
                return self._systemService.getLoad();
            }).then(function(load) {
                self.systemInfo.load = load;
                return self._vmRepository.getHardwareCapabilities();
            }).then(function(vm) {
                self.systemInfo.vmSupport = vm.vtx_enabled ?
                    vm.unrestricted_guest ? "Full" : "Partial" :
                    vm.svm_features ? "Partial" : "None";
            });
        }
    },

    enterDocument: {
        value: function () {
            return this._systemService.getTime().then(this._startTimer.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._stopTimer();
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
