var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

exports.VolumeSpace = Component.specialize({

    _handleVolumeDatasetUpdate: {
        value: function() {
            // this is where one would convert the volume dataset's object
            // into json which is favored by d3 and friends
            // PS: I do not like that I have to do this myself (i.e the conversion to json)
        }
    }
    templateDidLoad: {
        value: function () {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener(
                "volumeDatasetUpdated",
                this._handleVolumeDatasetUpdate.bind(this)
            )
        }
    },

    enterDocument: {
        value: function () {
            if (!this.datasets) {
                var self = this;

                this.application.dataService.fetchData(Model.VolumeDataset).then(function(datasets) {
                    self._datasets = datasets;
                    // call the function below to make the initial json representation of
                    // the volume datasets obj
                    self._handleVolumeDatasetUpdate();
                });
            }
        }
    }

});
