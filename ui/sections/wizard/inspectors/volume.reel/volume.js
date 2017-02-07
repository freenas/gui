var Component = require("montage/ui/component").Component;

exports.Volume = Component.specialize(/** @lends Volume# */ {

    templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
        }
    },

    enterDocument:{
        value: function (isFirstTime) {
            if (isFirstTime) {
                var self = this;
                this._sectionService.clearReservedDisks();
                this._sectionService.listAvailableDisks().then(function (disks) {
                    self.availableDisks = disks;
                });
            }

            //Thanks to the binding.
            if (this.object.topology && this.object.topology.data) {
                this.context.isNextStepDisabled = !this.object.id || this.object.topology.data.length === 0;
            }
        }
    },

    exitDocument: {
        value: function() {
            this._sectionService.clearReservedDisks();
        }
    }

});
