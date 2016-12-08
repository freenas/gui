var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

exports.VolumeSpace = Component.specialize({

    enterDocument: {
        value: function () {
            if (!this.datasets) {
                var self = this;

                this.application.dataService.fetchData(Model.VolumeDataset).then(function(datasets) {
                    self._datasets = datasets;
                });
            }
        }
    }

});
