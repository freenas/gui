var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RoutingService = require('core/service/routing-service').RoutingService,
    _ = require("lodash");

exports.Debug = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.routingService = RoutingService.getInstance();
        }
    },

    consoleData: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.isLoading = true;
                this._sectionService.getSystemAdvanced().then(function(consoleData) {
                    self.object = consoleData;
                    self.object._isDebugUiEnabled = !!self.object.debugui;
                    self._snapshotDataObjectsIfNecessary();
                    self.isLoading = false;
                });
            }
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveSystemAdvanced(this.object);
        }
    },

    handleDebuggerUrlAction: {
        value: function() {
            window.open('http://' + window.location.hostname + ':8180' , '_blank');
        }
    },

    handleDownloadDebugAction: {
        value: function() {
            var self = this;
            var todayString = (new Date()).toISOString().split('T')[0];
            this._sectionService.getSystemVersion().then(function(systemVersion) {
                self.systemVersion = systemVersion.split("-")[3];
            });
            this._sectionService.getDebugFileAddress().then(function(debugObject) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = debugObject.link;
                    downloadLink.download = "FreeNAS10" + "-" + self.systemVersion + "-" + todayString + "-" + "debug.tar.gz";
                    downloadLink.click();
            });
        }
    },

    revert: {
        value: function() {
            this.object.debugkernel = this._object.debugkernel;
            this.object.uploadcrash = this._object.uploadcrash;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._object) {
                this._object = _.cloneDeep(this.object);
            }
        }
    }
});
