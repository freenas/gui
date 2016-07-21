var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Containers
 * @extends Component
 */
exports.Containers = Component.specialize({

    _loadDataPromise: {
        value: null
    },

    templates: {
        value: null
    },

    virtualMachines: {
        value: null
    },

    containerSection: {
        value: null
    },

    enterDocument: {
        value: function() {
            this._loadDataIfNeeded();
        }
    },

    _loadDataIfNeeded: {
        value: function() {
            if (!this._loadDataPromise && !this.containerSection ) {
                var dataService = this.application.dataService,
                    virtualMachineService = this.application.virtualMachineService,
                    self = this;

                this._loadDataPromise = dataService.getNewInstanceForType(Model.ContainerSection).then(function(containerSection) {
                    containerSection.isLoading = true;
                    self.containerSection = containerSection;

                    return self._listVirtualMachines();
                }).then(function() {
                    self.containerSection.isLoading = false;
                    self._loadDataPromise = null;
                });
            }
        }
    },

    _listVirtualMachines: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.Vm).then(function(virtualMachines) {
                self.containerSection.virtualMachines = virtualMachines;
            });

        }
    }

});
