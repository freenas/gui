var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Virtualization
 * @extends Component
 */
exports.Virtualization = Component.specialize({

    _loadDataPromise: {
        value: null
    },

    templates: {
        value: null
    },

    virtualMachines: {
        value: null
    },

    virtualMachineSection: {
        value: null
    },

    enterDocument: {
        value: function() {
            this._loadDataIfNeeded();
        }
    },

    _loadDataIfNeeded: {
        value: function() {
            if (!this._loadDataPromise && !this.virtualMachineSection ) {
                var dataService = this.application.dataService,
                    virtualMachineService = this.application.virtualMachineService,
                    self = this;

                this._loadDataPromise = dataService.getNewInstanceForType(Model.VirtualMachineSection).then(function(virtualMachineSection) {
                    virtualMachineSection.isLoading = true;
                    self.virtualMachineSection = virtualMachineSection;

                    return Promise.all([self._listVirtualMachines(), self._listTemplates()]);
                }).then(function() {
                    self.virtualMachineSection.isLoading = false;
                    self._loadDataPromise = null;
                });
            }
        }
    },

    _listVirtualMachines: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.Vm).then(function(virtualMachines) {
                self.virtualMachineSection.virtualMachines = virtualMachines;
            });

        }
    },

    _listTemplates: {
        value: function() {
            var self = this;

            return this.application.virtualMachineService.getTemplates().then(function(templates) {
                self.virtualMachineSection.templates = templates;
            });
        }
    }

});
