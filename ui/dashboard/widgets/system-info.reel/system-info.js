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
            if (firstTime) {
                this._fetchSystemInfo();
            }
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
                return self._loadUname();
            }).then(function(uname) {
                self.systemInfo.uname = uname;
                return self._loadTime();
            }).then(function(time) {
                self.systemInfo.time = time;
                return self._loadDisks();
            }).then(function(disks) {
                self.systemInfo.disks = disks;
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

    _loadUname: {
        value: function() {
            return this._systemInfoService.getUname();
        }
    },

    _loadTime: {
        value: function() {
            return this._systemInfoService.getTime();
        }
    },

    _loadDisks: {
        value: function() {
            return this._dataService.fetchData(Model.Disk);
        }
    }
});
