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

    virtualMachines: {
        value: null
    },

    enterDocument: {
        value: function() {
            this._loadDataIfNeeded();
        }
    },

    _loadDataIfNeeded: {
        value: function() {
            if (!this._loadDataPromise && !this.virtualMachines ) {
                var dataService = this.application.dataService,
                    virtualMachineService = this.application.virtualMachineService,
                    self = this;

                this.isLoading = true;

                this._loadDataPromise = this._listVirtualMachines().then(function() {
                    self.isLoading = false;
                    self._loadDataPromise = null;
                });
            }
        }
    },

    _listVirtualMachines: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.Vm).then(function(virtualMachines) {
                self.virtualMachines = virtualMachines;
            });
        }
    }

});
