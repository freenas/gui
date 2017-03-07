var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    Vm = require('core/model/Vm').Vm,
    _ = require('lodash');

exports.DockerHost = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.memoryUnits = Units.MEGABYTE_SIZES;
            this.eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this.DEFAULT_STRING = this._sectionService.DEFAULT_STRING;

                this._sectionService.listDatastores().then(function(datastores) {
                    self._datastores = datastores;
                });
            }

            this._sectionService.initializeDockerHost(this.object);
            this.vmChangeListener = this.eventDispatcherService.addEventListener(Vm.getEventNames().change(this.object._vm.id), this.handleVmChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.eventDispatcherService.removeEventListener(Vm.getEventNames().change(this.object._vm.id), this.vmChangeListener);
        }
    },

    handleStartAction: {
        value: function() {
            this.object._isShutdownRequested = false;
            this._sectionService.startVm(this.object._vm);
        }
    },

    handleShutdownAction: {
        value: function() {
            this._sectionService.stopVm(this.object._vm, !!this.object._isShutdownRequested);
            this.object._isShutdownRequested = true;
        }
    },

    handleRebootAction: {
        value: function() {
            this.object._isShutdownRequested = false;
            this._sectionService.rebootVm(this.object._vm);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;
            this._sectionService.getSerialConsoleUrlForDockerHost(this.object).then(function(serialConsoleUrl) {
                window.open(serialConsoleUrl, self.object.name + " Serial Console");
            });
        }
    },

    handleVmChange: {
        value: function(state) {
            _.assign(this.object._vm, state.toJS());
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveDockerHost(this.object);
        }
    }
});
